/**
 * JWT Authentication Middleware
 * 
 * Validates Bearer tokens and attaches user info to request
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Authenticate middleware - validates JWT token
 * Attaches user info to req.user if valid
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists and is Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'No token provided. Please login.' 
      });
      return;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Invalid token format' 
      });
      return;
    }

    // Verify JWT token
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        email: string;
        role: string;
      };
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          error: 'Token expired',
          message: 'Your session has expired. Please login again.' 
        });
        return;
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          error: 'Invalid token',
          message: 'Authentication token is invalid.' 
        });
        return;
      }
      throw jwtError;
    }

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
      }
    });

    if (!user) {
      res.status(401).json({ 
        error: 'User not found',
        message: 'User account no longer exists.' 
      });
      return;
    }

    if (!user.verified) {
      res.status(401).json({ 
        error: 'Account not verified',
        message: 'Please verify your account.' 
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    // Continue to next middleware/route
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred during authentication.' 
    });
  }
};

/**
 * Require admin role middleware
 * Must be used after authenticate middleware
 */
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required.' 
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Admin access required.' 
    });
    return;
  }

  next();
};
