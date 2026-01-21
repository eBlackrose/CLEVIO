/**
 * CLEVIO Financial Services Platform
 * Backend API Server
 * 
 * This server handles authentication, 2FA, and admin endpoints
 * with comprehensive debug logging for troubleshooting.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Business Rules Constants
const MIN_TEAM_MEMBERS_FOR_SERVICES = 5;
const COMMITMENT_MONTHS = 6;

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// Email configuration
const EMAIL_MODE = process.env.EMAIL_MODE || 'log'; // 'log' or 'sendgrid'
const EMAIL_FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@clevio.com';
const OTP_EXP_MINUTES = parseInt(process.env.OTP_EXP_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
const OTP_RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 30;

// Security: Helmet for secure headers
app.use(helmet({
  contentSecurityPolicy: isDev ? false : undefined, // Disable CSP in dev for easier debugging
}));

// CORS configuration
const corsOptions = {
  origin: process.env.APP_BASE_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 requests per minute
  message: 'Too many OTP requests, please try again later',
});

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const requestId = Math.random().toString(36).substring(7);
  req.requestId = requestId;
  
  console.log(`[${timestamp}] [${requestId}] ${req.method} ${req.path} from ${req.ip}`);
  
  // Log request body (mask sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[REDACTED]';
    if (safeBody.code) safeBody.code = isDev ? safeBody.code : '[REDACTED]';
    console.log(`[${requestId}] Request body:`, safeBody);
  }
  
  next();
});

// Configure SendGrid (only if using sendgrid mode)
if (EMAIL_MODE === 'sendgrid') {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid API key configured');
  } else {
    console.warn('⚠️ EMAIL_MODE is sendgrid but SENDGRID_API_KEY not configured');
  }
} else {
  console.log('📧 Email mode: LOG (emails will be logged to console)');
}

// Initialize test admin (development only)
async function initializeTestAdmin() {
  if (isDev) {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@clevio.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
      });
      
      if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
          data: {
            email: adminEmail,
            passwordHash,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            verified: true,
          }
        });
        console.log(`🔧 Development mode: Test admin created (${adminEmail} / ${adminPassword})`);
      } else {
        console.log(`🔧 Development mode: Test admin already exists (${adminEmail})`);
      }
    } catch (error) {
      console.error('Error creating test admin:', error.message);
    }
  }
}

// Call on startup
initializeTestAdmin();

/**
 * User Signup Endpoint
 * POST /api/user/signup
 */
app.post('/api/user/signup', authLimiter, async (req, res) => {
  const requestId = req.requestId;
  
  try {
    console.group(`🔧 [${requestId}] User Signup`);
    
    const { email, password, firstName, lastName, companyName } = req.body;
    
    console.log(`Signup attempt: ${email}`);
    console.log('User data:', { email, firstName, lastName, companyName });
    
    // Validation
    if (!email || !password || !firstName || !lastName || !companyName) {
      console.warn(`❌ Signup validation failed - missing fields`);
      console.groupEnd();
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.warn(`❌ Signup failed - user already exists: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user and company in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        verified: false,
        role: 'user',
        company: {
          create: {
            name: companyName,
          }
        }
      },
      include: {
        company: true
      }
    });
    
    console.log(`✅ User created successfully: ${email}`);
    console.log(`Company created: ${companyName}`);
    console.groupEnd();
    
    res.status(200).json({ 
      message: 'Account created successfully',
      email 
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error in signup:`, error.message);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * User Login Endpoint (Sends 2FA OTP)
 * POST /api/user/login
 */
app.post('/api/user/login', authLimiter, async (req, res) => {
  const requestId = req.requestId;
  
  try {
    console.group(`🔐 [${requestId}] User Login`);
    
    const { email, password } = req.body;
    
    console.log(`Login attempt: ${email}`);
    
    // Validation
    if (!email || !password) {
      console.warn(`❌ Login validation failed - missing credentials`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });
    
    console.log(`User lookup: ${user ? 'Found' : 'Not found'}`);
    
    if (!user) {
      console.warn(`❌ Login failed - user not found: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    console.log(`Password validation: ${passwordValid ? 'Valid' : 'Invalid'}`);
    
    if (!passwordValid) {
      console.warn(`❌ Login failed - invalid password for: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);
    
    // Delete any existing OTP codes for this email
    await prisma.oTPCode.deleteMany({
      where: { email }
    });
    
    // Store OTP in database
    await prisma.oTPCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
        attempts: 0,
      }
    });
    
    if (isDev) {
      console.log(`✅ Generated OTP for ${email}: ${otp}`);
    } else {
      console.log(`✅ Generated OTP for ${email} (hidden in production)`);
    }
    console.log(`OTP expires at: ${expiresAt.toISOString()}`);
    
    // Send OTP via email
    try {
      console.log(`📧 Sending OTP email to ${email}...`);
      
      const msg = {
        to: email,
        from: EMAIL_FROM,
        subject: 'CLEVIO - Your Verification Code',
        text: `Your CLEVIO verification code is: ${otp}\n\nThis code expires in ${OTP_EXP_MINUTES} minutes.\n\nIf you didn't request this code, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">CLEVIO Verification Code</h2>
            <p>Your verification code is:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code expires in ${OTP_EXP_MINUTES} minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      };
      
      if (EMAIL_MODE === 'sendgrid' && process.env.SENDGRID_API_KEY) {
        await sgMail.send(msg);
        console.log(`✅ OTP email sent successfully to ${email}`);
      } else {
        // Log mode - log to console instead of sending email
        console.log(`\n🔐 ═══════════════════════════════════════`);
        console.log(`   EMAIL MODE: LOG`);
        console.log(`   TO: ${email}`);
        console.log(`   SUBJECT: ${msg.subject}`);
        console.log(`   CODE: ${otp}`);
        console.log(`   EXPIRES: ${new Date(expiresAt).toLocaleString()}`);
        console.log(`═══════════════════════════════════════\n`);
      }
      
    } catch (emailError) {
      console.error(`❌ Email sending failed:`, emailError.message);
      if (emailError.response) {
        console.error('SendGrid response:', emailError.response.body);
      }
      // In log mode or dev, continue anyway
      if (EMAIL_MODE !== 'log' && !isDev) {
        console.groupEnd();
        return res.status(500).json({ message: 'Failed to send verification code' });
      }
    }
    
    console.groupEnd();
    
    res.status(200).json({ 
      message: 'Verification code sent to your email',
      email 
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error in login:`, error.message);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * 2FA Verification Endpoint
 * POST /api/user/verify-2fa
 */
app.post('/api/user/verify-2fa', authLimiter, async (req, res) => {
  const requestId = req.requestId;
  
  try {
    console.group(`🔐 [${requestId}] 2FA Verification`);
    
    const { email, code } = req.body;
    
    console.log(`2FA verification attempt: ${email}`);
    console.log(`Submitted code: ${isDev ? code : '[REDACTED]'}`);
    
    // Validation
    if (!email || !code) {
      console.warn(`❌ 2FA validation failed - missing data`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email and code required' });
    }
    
    // Get stored OTP from database
    const storedOtp = await prisma.oTPCode.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Stored OTP lookup: ${storedOtp ? 'Found' : 'Not found'}`);
    
    if (!storedOtp) {
      console.warn(`❌ 2FA failed - no OTP found for: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'No verification code found. Please sign in again.' });
    }
    
    // Check expiration
    const now = new Date();
    const isExpired = now > storedOtp.expiresAt;
    const timeRemaining = storedOtp.expiresAt.getTime() - now.getTime();
    
    console.log(`OTP expiry check:`, {
      now: now.toISOString(),
      expires: storedOtp.expiresAt.toISOString(),
      timeRemainingMs: timeRemaining,
      isExpired,
    });
    
    if (isExpired) {
      await prisma.oTPCode.delete({ where: { id: storedOtp.id } });
      console.error(`❌ 2FA failed - code expired for: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'Verification code expired. Please sign in again.' });
    }
    
    // Check attempts (max configured)
    if (storedOtp.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.oTPCode.delete({ where: { id: storedOtp.id } });
      console.error(`❌ 2FA failed - too many attempts for: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'Too many failed attempts. Please sign in again.' });
    }
    
    // Verify code
    const codeMatches = storedOtp.code === code;
    console.log(`Code comparison:`, {
      expected: isDev ? storedOtp.code : '[REDACTED]',
      submitted: isDev ? code : '[REDACTED]',
      matches: codeMatches,
    });
    
    if (!codeMatches) {
      // Increment attempts
      await prisma.oTPCode.update({
        where: { id: storedOtp.id },
        data: { attempts: storedOtp.attempts + 1 }
      });
      
      const attemptsRemaining = OTP_MAX_ATTEMPTS - (storedOtp.attempts + 1);
      console.error(`❌ 2FA failed - invalid code for: ${email} (${attemptsRemaining} attempts remaining)`);
      console.groupEnd();
      return res.status(400).json({ 
        message: 'Invalid verification code',
        attemptsRemaining 
      });
    }
    
    // Success - clear OTP and mark user as verified
    await prisma.oTPCode.delete({ where: { id: storedOtp.id } });
    
    const user = await prisma.user.update({
      where: { email },
      data: { verified: true },
      include: { company: true }
    });
    
    console.log(`✅ 2FA verification successful for: ${email}`);
    console.log(`User authenticated:`, {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    console.groupEnd();
    
    res.status(200).json({ 
      message: 'Verification successful',
      user: {
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.company?.name || '',
      }
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error in 2FA verification:`, error.message);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Resend OTP Endpoint
 * POST /api/user/resend-otp
 */
app.post('/api/user/resend-otp', otpLimiter, async (req, res) => {
  const requestId = req.requestId;
  
  try {
    console.group(`🔁 [${requestId}] Resend OTP`);
    
    const { email } = req.body;
    
    console.log(`Resend OTP request: ${email}`);
    
    if (!email) {
      console.warn(`❌ Resend validation failed - missing email`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email required' });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.warn(`❌ Resend failed - user not found: ${email}`);
      console.groupEnd();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check rate limiting (last code creation time)
    const lastCode = await prisma.oTPCode.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' }
    });
    
    if (lastCode) {
      const timeSinceLastCode = Date.now() - lastCode.createdAt.getTime();
      if (timeSinceLastCode < OTP_RESEND_COOLDOWN * 1000) {
        const waitTime = Math.ceil((OTP_RESEND_COOLDOWN * 1000 - timeSinceLastCode) / 1000);
        console.warn(`❌ Resend rate limited for: ${email} (wait ${waitTime}s)`);
        console.groupEnd();
        return res.status(429).json({ 
          message: `Please wait ${waitTime} seconds before requesting a new code`,
          waitTime
        });
      }
    }
    
    // Delete old codes
    await prisma.oTPCode.deleteMany({ where: { email } });
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);
    
    await prisma.oTPCode.create({
      data: {
        email,
        code: otp,
        expiresAt,
        attempts: 0,
      }
    });
    
    // Send OTP email (reuse email logic)
    try {
      const msg = {
        to: email,
        from: EMAIL_FROM,
        subject: 'CLEVIO - Your Verification Code',
        text: `Your CLEVIO verification code is: ${otp}\n\nThis code expires in ${OTP_EXP_MINUTES} minutes.\n\nIf you didn't request this code, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000;">CLEVIO Verification Code</h2>
            <p>Your verification code is:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This code expires in ${OTP_EXP_MINUTES} minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
      };
      
      if (EMAIL_MODE === 'sendgrid' && process.env.SENDGRID_API_KEY) {
        await sgMail.send(msg);
        console.log(`✅ OTP email sent to ${email}`);
      } else {
        console.log(`\n🔐 ═══════════════════════════════════════`);
        console.log(`   EMAIL MODE: LOG - CODE: ${otp}`);
        console.log(`═══════════════════════════════════════\n`);
      }
    } catch (emailError) {
      console.error(`❌ Email sending failed:`, emailError.message);
    }
    
    console.log(`✅ New OTP generated for ${email}`);
    console.groupEnd();
    
    res.status(200).json({ 
      message: 'New verification code sent',
      cooldown: OTP_RESEND_COOLDOWN
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error in resend:`, error.message);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Admin Login Endpoint
 * POST /api/admin/login
 */
app.post('/api/admin/login', authLimiter, async (req, res) => {
  const requestId = req.requestId;
  
  try {
    console.group(`🔑 [${requestId}] ADMIN Login`);
    
    const { email, password } = req.body;
    
    console.log(`ADMIN login attempt: ${email}`);
    
    // Validation
    if (!email || !password) {
      console.warn(`❌ ADMIN login validation failed - missing credentials`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    // Check if admin exists
    const admin = await prisma.user.findUnique({
      where: { email }
    });
    
    console.log(`ADMIN lookup: ${admin ? 'Found' : 'Not found'}`);
    
    if (!admin || admin.role !== 'admin') {
      console.warn(`❌ ADMIN login failed - user not found or not admin: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.passwordHash);
    console.log(`ADMIN password validation: ${passwordValid ? 'Valid' : 'Invalid'}`);
    
    if (!passwordValid) {
      console.warn(`❌ ADMIN login failed - invalid password for: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    console.log(`✅ ADMIN login successful: ${email}`);
    console.groupEnd();
    
    res.status(200).json({ 
      message: 'Admin authenticated successfully',
      admin: {
        email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      }
    });
    
  } catch (error) {
    console.error(`❌ [${requestId}] Unexpected error in ADMIN login:`, error.message);
    console.error('Stack trace:', error.stack);
    console.groupEnd();
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get User Profile and Data
 * GET /api/user/me
 */
app.get('/api/user/me', async (req, res) => {
  const requestId = req.requestId;
  
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: {
            employees: true,
            subscriptions: true,
            payrollSchedule: true,
            notificationPreferences: true,
            billingHistory: {
              orderBy: { date: 'desc' },
              take: 10
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get AMEX card if exists
    const amexCard = await prisma.amexCard.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    // Get advisory sessions
    const advisorySessions = await prisma.advisorySession.findMany({
      where: {
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });
    
    res.status(200).json({
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        verified: user.verified,
        role: user.role,
      },
      company: user.company ? {
        id: user.company.id,
        name: user.company.name,
        ein: user.company.ein,
        businessAddress: user.company.businessAddress,
        city: user.company.city,
        state: user.company.state,
        zipCode: user.company.zipCode,
        phone: user.company.phone,
        employees: user.company.employees,
        subscriptions: user.company.subscriptions[0] || null,
        payrollSchedule: user.company.payrollSchedule || null,
        notificationPreferences: user.company.notificationPreferences || null,
        billingHistory: user.company.billingHistory,
      } : null,
      amexCard,
      advisorySessions,
    });
  } catch (error) {
    console.error(`[${requestId}] Error getting user data:`, error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Company Profile Endpoints
 */

// GET Company
app.get('/api/company', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: { company: true }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(user.company);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT Company
app.put('/api/company', async (req, res) => {
  const { email, name, ein, businessAddress, city, state, zipCode, phone } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const updated = await prisma.company.update({
      where: { id: user.company.id },
      data: {
        name: name || user.company.name,
        ein: ein !== undefined ? ein : user.company.ein,
        businessAddress: businessAddress !== undefined ? businessAddress : user.company.businessAddress,
        city: city !== undefined ? city : user.company.city,
        state: state !== undefined ? state : user.company.state,
        zipCode: zipCode !== undefined ? zipCode : user.company.zipCode,
        phone: phone !== undefined ? phone : user.company.phone,
      }
    });
    
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Notification Preferences Endpoints
 */

// GET Notifications
app.get('/api/notifications', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: { notificationPreferences: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Create default if doesn't exist
    if (!user.company.notificationPreferences) {
      const prefs = await prisma.notificationPreferences.create({
        data: {
          companyId: user.company.id,
          payrollReminders: true,
          advisoryReminders: true,
          paymentConfirmations: true,
          monthlyReports: true,
        }
      });
      return res.status(200).json(prefs);
    }
    
    res.status(200).json(user.company.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT Notifications
app.put('/api/notifications', async (req, res) => {
  const { email, payrollReminders, advisoryReminders, paymentConfirmations, monthlyReports } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          include: { notificationPreferences: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    let prefs;
    if (user.company.notificationPreferences) {
      prefs = await prisma.notificationPreferences.update({
        where: { id: user.company.notificationPreferences.id },
        data: {
          payrollReminders: payrollReminders !== undefined ? payrollReminders : user.company.notificationPreferences.payrollReminders,
          advisoryReminders: advisoryReminders !== undefined ? advisoryReminders : user.company.notificationPreferences.advisoryReminders,
          paymentConfirmations: paymentConfirmations !== undefined ? paymentConfirmations : user.company.notificationPreferences.paymentConfirmations,
          monthlyReports: monthlyReports !== undefined ? monthlyReports : user.company.notificationPreferences.monthlyReports,
        }
      });
    } else {
      prefs = await prisma.notificationPreferences.create({
        data: {
          companyId: user.company.id,
          payrollReminders: payrollReminders ?? true,
          advisoryReminders: advisoryReminders ?? true,
          paymentConfirmations: paymentConfirmations ?? true,
          monthlyReports: monthlyReports ?? true,
        }
      });
    }
    
    res.status(200).json(prefs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Team (Employees & Contractors) Endpoints
 */

// GET Team
app.get('/api/team', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: { employees: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(user.company.employees);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST Team Member
app.post('/api/team', async (req, res) => {
  const { email, fullName, memberEmail, type, salary, bankName, routingNumber, accountLast4, ssnLast4 } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const employee = await prisma.employee.create({
      data: {
        companyId: user.company.id,
        fullName,
        email: memberEmail,
        type: type || 'employee',
        salary: salary ? parseFloat(salary) : null,
        bankName: bankName || null,
        routingNumber: routingNumber || null,
        accountLast4: accountLast4 || null,
        ssnLast4: ssnLast4 || null,
        status: 'active',
      }
    });
    
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT Team Member
app.put('/api/team/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, email: memberEmail, type, salary, bankName, routingNumber, accountLast4, ssnLast4, status } = req.body;
  
  try {
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fullName: fullName !== undefined ? fullName : undefined,
        email: memberEmail !== undefined ? memberEmail : undefined,
        type: type !== undefined ? type : undefined,
        salary: salary !== undefined ? parseFloat(salary) : undefined,
        bankName: bankName !== undefined ? bankName : undefined,
        routingNumber: routingNumber !== undefined ? routingNumber : undefined,
        accountLast4: accountLast4 !== undefined ? accountLast4 : undefined,
        ssnLast4: ssnLast4 !== undefined ? ssnLast4 : undefined,
        status: status !== undefined ? status : undefined,
      }
    });
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE Team Member
app.delete('/api/team/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.employee.delete({
      where: { id }
    });
    
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * AMEX / Payments Endpoints
 */

// GET AMEX Card
app.get('/api/payments/amex', async (req, res) => {
  try {
    const card = await prisma.amexCard.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    res.status(200).json(card || { connected: false });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT AMEX Card
app.put('/api/payments/amex', async (req, res) => {
  const { last4, cardName, expiryMonth, expiryYear, token } = req.body;
  
  try {
    // Delete old cards
    await prisma.amexCard.deleteMany({});
    
    const card = await prisma.amexCard.create({
      data: {
        last4,
        cardName,
        expiryMonth: expiryMonth ? parseInt(expiryMonth) : null,
        expiryYear: expiryYear ? parseInt(expiryYear) : null,
        token: token || null,
        connected: true,
      }
    });
    
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET Billing History
app.get('/api/billing/history', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: {
            billingHistory: {
              orderBy: { date: 'desc' }
            }
          }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(user.company.billingHistory);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Subscriptions / Tiers Endpoints
 */

// GET Subscriptions
app.get('/api/subscriptions', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: { subscriptions: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    let subscription = user.company.subscriptions[0];
    
    // Create default subscription if doesn't exist
    if (!subscription) {
      subscription = await prisma.subscription.create({
        data: {
          companyId: user.company.id,
          payrollEnabled: false,
          taxEnabled: false,
          advisoryEnabled: false,
        }
      });
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT Subscriptions
app.put('/api/subscriptions', async (req, res) => {
  const { email, payrollEnabled, taxEnabled, advisoryEnabled } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          include: { 
            subscriptions: true,
            employees: true 
          }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Business Rule: Check minimum team members
    const activeEmployees = user.company.employees.filter(e => e.status === 'active');
    if (activeEmployees.length < MIN_TEAM_MEMBERS_FOR_SERVICES) {
      if (payrollEnabled || advisoryEnabled) {
        return res.status(400).json({ 
          message: `You need at least ${MIN_TEAM_MEMBERS_FOR_SERVICES} team members to activate payroll or advisory services`,
          currentTeamSize: activeEmployees.length,
          required: MIN_TEAM_MEMBERS_FOR_SERVICES
        });
      }
    }
    
    let subscription = user.company.subscriptions[0];
    
    if (subscription) {
      // Check commitment dates before allowing disable
      const now = new Date();
      const canDisablePayroll = !subscription.commitmentEndDate || now >= subscription.commitmentEndDate;
      
      const updateData = {};
      
      if (payrollEnabled !== undefined) {
        if (payrollEnabled && !subscription.payrollEnabled) {
          // Enabling - set commitment
          updateData.payrollEnabled = true;
          updateData.startDate = new Date();
          updateData.commitmentEndDate = new Date(Date.now() + COMMITMENT_MONTHS * 30 * 24 * 60 * 60 * 1000);
          console.log(`✅ Payroll enabled with ${COMMITMENT_MONTHS}-month commitment`);
        } else if (!payrollEnabled && subscription.payrollEnabled) {
          // Disabling - check commitment
          if (canDisablePayroll) {
            updateData.payrollEnabled = false;
            console.log(`✅ Payroll disabled (commitment period ended)`);
          } else {
            const daysRemaining = Math.ceil((subscription.commitmentEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return res.status(400).json({ 
              message: `Cannot disable payroll before commitment end date (${daysRemaining} days remaining)`,
              commitmentEndDate: subscription.commitmentEndDate,
              daysRemaining
            });
          }
        }
      }
      
      if (taxEnabled !== undefined) updateData.taxEnabled = taxEnabled;
      if (advisoryEnabled !== undefined) updateData.advisoryEnabled = advisoryEnabled;
      
      subscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: updateData
      });
    } else {
      // Create new subscription
      subscription = await prisma.subscription.create({
        data: {
          companyId: user.company.id,
          payrollEnabled: payrollEnabled ?? false,
          taxEnabled: taxEnabled ?? false,
          advisoryEnabled: advisoryEnabled ?? false,
          startDate: payrollEnabled ? new Date() : null,
          commitmentEndDate: payrollEnabled ? new Date(Date.now() + COMMITMENT_MONTHS * 30 * 24 * 60 * 60 * 1000) : null,
        }
      });
    }
    
    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error updating subscriptions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Payroll Endpoints
 */

// GET Payroll Schedule
app.get('/api/payroll/schedule', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: { payrollSchedule: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.status(200).json(user.company.payrollSchedule || null);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT Payroll Schedule
app.put('/api/payroll/schedule', async (req, res) => {
  const { email, frequency, dayOfWeek, dayOfMonth } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          include: { payrollSchedule: true }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Calculate next payroll date based on frequency
    const calculateNextPayroll = () => {
      const now = new Date();
      // Simplified calculation - would need more sophisticated logic in production
      if (frequency === 'weekly') {
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (frequency === 'biweekly') {
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, dayOfMonth || 1);
      }
    };
    
    let schedule;
    if (user.company.payrollSchedule) {
      schedule = await prisma.payrollSchedule.update({
        where: { id: user.company.payrollSchedule.id },
        data: {
          frequency: frequency || user.company.payrollSchedule.frequency,
          dayOfWeek: dayOfWeek !== undefined ? (dayOfWeek ? parseInt(dayOfWeek) : null) : user.company.payrollSchedule.dayOfWeek,
          dayOfMonth: dayOfMonth !== undefined ? (dayOfMonth ? parseInt(dayOfMonth) : null) : user.company.payrollSchedule.dayOfMonth,
          nextPayrollDate: calculateNextPayroll(),
        }
      });
    } else {
      schedule = await prisma.payrollSchedule.create({
        data: {
          companyId: user.company.id,
          frequency: frequency || 'biweekly',
          dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : null,
          dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : null,
          nextPayrollDate: calculateNextPayroll(),
        }
      });
    }
    
    res.status(200).json(schedule);
  } catch (error) {
    console.error('Error updating payroll schedule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET Upcoming Payroll
app.get('/api/payroll/upcoming', async (req, res) => {
  const { email } = req.query;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        company: {
          include: {
            payrollSchedule: true,
            employees: true
          }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const activeEmployees = user.company.employees.filter(e => e.status === 'active');
    const totalAmount = activeEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
    
    res.status(200).json({
      nextDate: user.company.payrollSchedule?.nextPayrollDate || null,
      totalAmount,
      employeeCount: activeEmployees.length,
      employees: activeEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST Run Payroll
app.post('/api/payroll/run', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          include: {
            employees: true,
            payrollSchedule: true,
            subscriptions: true
          }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Business Rule: Check payroll requirements
    const subscription = user.company.subscriptions[0];
    if (!subscription?.payrollEnabled) {
      return res.status(400).json({ 
        message: 'Payroll service is not enabled',
        hint: 'Enable payroll in Services & Subscriptions first'
      });
    }
    
    // Business Rule: Check AMEX card connected
    const amexCard = await prisma.amexCard.findFirst({
      where: { connected: true }
    });
    if (!amexCard) {
      return res.status(400).json({ 
        message: 'AMEX card not connected',
        hint: 'Connect your AMEX card in Payments to run payroll'
      });
    }
    
    // Business Rule: Check minimum team members
    const activeEmployees = user.company.employees.filter(e => e.status === 'active');
    if (activeEmployees.length < MIN_TEAM_MEMBERS_FOR_SERVICES) {
      return res.status(400).json({ 
        message: `You need at least ${MIN_TEAM_MEMBERS_FOR_SERVICES} team members to run payroll`,
        currentTeamSize: activeEmployees.length,
        required: MIN_TEAM_MEMBERS_FOR_SERVICES
      });
    }
    
    const totalAmount = activeEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
    
    // Business Rule: Calculate fee based on active tiers
    let feePercent = 0;
    if (subscription.payrollEnabled) feePercent += 2;
    if (subscription.taxEnabled) feePercent += 2;
    if (subscription.advisoryEnabled) feePercent += 1;
    
    const fee = totalAmount * (feePercent / 100);
    const totalWithFee = totalAmount + fee;
    
    // Create billing history record
    await prisma.billingHistory.create({
      data: {
        companyId: user.company.id,
        date: new Date(),
        description: `Payroll - ${activeEmployees.length} employees (${feePercent}% fee)`,
        amount: totalWithFee,
        status: 'paid',
      }
    });
    
    console.log(`✅ Payroll run: $${totalAmount.toFixed(2)} + $${fee.toFixed(2)} fee = $${totalWithFee.toFixed(2)}`);
    
    // Update next payroll date
    if (user.company.payrollSchedule) {
      const schedule = user.company.payrollSchedule;
      const nextDate = new Date();
      if (schedule.frequency === 'weekly') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else if (schedule.frequency === 'biweekly') {
        nextDate.setDate(nextDate.getDate() + 14);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      
      await prisma.payrollSchedule.update({
        where: { id: schedule.id },
        data: { nextPayrollDate: nextDate }
      });
    }
    
    res.status(200).json({
      message: 'Payroll run successfully',
      payrollAmount: totalAmount,
      fee: fee,
      totalCharged: totalWithFee,
      feePercent: feePercent,
      employeeCount: activeEmployees.length,
    });
  } catch (error) {
    console.error('Error running payroll:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Advisory Sessions Endpoints
 */

// GET Advisory Sessions
app.get('/api/advisory', async (req, res) => {
  try {
    const sessions = await prisma.advisorySession.findMany({
      where: {
        date: { gte: new Date() }
      },
      orderBy: { date: 'asc' }
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST Advisory Session
app.post('/api/advisory', async (req, res) => {
  const { email, type, date, time, duration, advisor, meetingLink } = req.body;
  
  try {
    // Business Rule: Check advisory requirements
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          include: {
            employees: true,
            subscriptions: true
          }
        }
      }
    });
    
    if (!user?.company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const subscription = user.company.subscriptions[0];
    const activeEmployees = user.company.employees.filter(e => e.status === 'active');
    
    // Business Rule: Advisory requires 5+ team members AND (tax OR advisory tier active)
    if (activeEmployees.length < MIN_TEAM_MEMBERS_FOR_SERVICES) {
      return res.status(400).json({ 
        message: `Advisory sessions require at least ${MIN_TEAM_MEMBERS_FOR_SERVICES} team members`,
        currentTeamSize: activeEmployees.length,
        required: MIN_TEAM_MEMBERS_FOR_SERVICES,
        hint: 'Add more team members in Employees & Contractors'
      });
    }
    
    if (!subscription?.taxEnabled && !subscription?.advisoryEnabled) {
      return res.status(400).json({ 
        message: 'Advisory sessions require Tax or Advisory service to be enabled',
        hint: 'Enable Tax or Advisory tier in Services & Subscriptions'
      });
    }
    
    const session = await prisma.advisorySession.create({
      data: {
        type,
        date: new Date(date),
        time,
        duration: parseInt(duration),
        advisor: advisor || 'CLEVIO Advisor',
        status: 'scheduled',
        meetingLink: meetingLink || null,
      }
    });
    
    console.log(`✅ Advisory session scheduled: ${type} on ${date} at ${time}`);
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating advisory session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Health Check Endpoint
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  console.log(`[${req.requestId}] Health check`);
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    emailMode: EMAIL_MODE,
    sendgridConfigured: EMAIL_MODE === 'sendgrid' && !!process.env.SENDGRID_API_KEY,
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  console.warn(`[${req.requestId}] 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Endpoint not found' });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error(`[${req.requestId}] ❌ Global error handler:`, err.message);
  console.error('Stack trace:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

/**
 * Start Server
 */
app.listen(PORT, () => {
  console.log('\n🚀 ═══════════════════════════════════════════════════════');
  console.log(`   CLEVIO Backend Server Started`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Email Mode: ${EMAIL_MODE}`);
  console.log(`   SendGrid configured: ${EMAIL_MODE === 'sendgrid' && !!process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);
  console.log(`   Debug logging: ${isDev ? 'ENABLED' : 'Production mode'}`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (isDev) {
    console.log('📝 Development Mode Active:');
    console.log('   - Verbose logging enabled');
    console.log('   - OTP codes visible in console');
    console.log('   - Test admin account available');
    console.log(`   - Email mode: ${EMAIL_MODE}\n`);
  }
  
  console.log('📋 Available Endpoints:');
  console.log('   POST /api/user/signup - User registration');
  console.log('   POST /api/user/login - User login (sends 2FA code)');
  console.log('   POST /api/user/verify-2fa - Verify 2FA code');
  console.log('   POST /api/admin/login - Admin authentication');
  console.log('   GET  /api/health - Health check\n');
  
  console.log('👂 Server is listening for requests...\n');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n⚠️ SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️ SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
