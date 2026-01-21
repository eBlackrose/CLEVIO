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

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// Email configuration
const EMAIL_MODE = process.env.EMAIL_MODE || 'log'; // 'log' or 'sendgrid'
const EMAIL_FROM = process.env.SENDGRID_FROM_EMAIL || 'noreply@clevio.com';
const OTP_EXP_MINUTES = parseInt(process.env.OTP_EXP_MINUTES) || 10;
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS) || 5;
const OTP_RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 30;

// Middleware
app.use(cors());
app.use(express.json());

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

// In-memory storage (replace with database in production)
const users = new Map();
const otpCodes = new Map();
const adminUsers = new Map();

// Initialize with test admin (development only)
if (isDev) {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@clevio.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
  adminUsers.set(adminEmail, {
    password: adminPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  });
  console.log(`🔧 Development mode: Test admin created (${adminEmail} / ${adminPassword})`);
}

/**
 * User Signup Endpoint
 * POST /api/user/signup
 */
app.post('/api/user/signup', async (req, res) => {
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
    if (users.has(email)) {
      console.warn(`❌ Signup failed - user already exists: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Store user (in production, hash password with bcrypt)
    users.set(email, {
      password, // TODO: Hash with bcrypt in production
      firstName,
      lastName,
      companyName,
      createdAt: new Date().toISOString(),
    });
    
    console.log(`✅ User created successfully: ${email}`);
    console.log(`Total users in database: ${users.size}`);
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
app.post('/api/user/login', async (req, res) => {
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
    const user = users.get(email);
    console.log(`User lookup: ${user ? 'Found' : 'Not found'}`);
    
    if (!user) {
      console.warn(`❌ Login failed - user not found: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const passwordValid = user.password === password; // TODO: Use bcrypt.compare in production
    console.log(`Password validation: ${passwordValid ? 'Valid' : 'Invalid'}`);
    
    if (!passwordValid) {
      console.warn(`❌ Login failed - invalid password for: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + OTP_EXP_MINUTES * 60 * 1000;
    
    // Store OTP
    otpCodes.set(email, {
      code: otp,
      expires: expiresAt,
      attempts: 0,
    });
    
    if (isDev) {
      console.log(`✅ Generated OTP for ${email}: ${otp}`);
    } else {
      console.log(`✅ Generated OTP for ${email} (hidden in production)`);
    }
    console.log(`OTP expires at: ${new Date(expiresAt).toISOString()}`);
    
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
app.post('/api/user/verify-2fa', async (req, res) => {
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
    
    // Get stored OTP
    const storedOtp = otpCodes.get(email);
    console.log(`Stored OTP lookup: ${storedOtp ? 'Found' : 'Not found'}`);
    
    if (!storedOtp) {
      console.warn(`❌ 2FA failed - no OTP found for: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'No verification code found. Please sign in again.' });
    }
    
    // Check expiration
    const now = Date.now();
    const timeRemaining = storedOtp.expires - now;
    const isExpired = now > storedOtp.expires;
    
    console.log(`OTP expiry check:`, {
      now: new Date(now).toISOString(),
      expires: new Date(storedOtp.expires).toISOString(),
      timeRemainingMs: timeRemaining,
      isExpired,
    });
    
    if (isExpired) {
      otpCodes.delete(email);
      console.error(`❌ 2FA failed - code expired for: ${email}`);
      console.groupEnd();
      return res.status(400).json({ message: 'Verification code expired. Please sign in again.' });
    }
    
    // Check attempts (max configured)
    if (storedOtp.attempts >= OTP_MAX_ATTEMPTS) {
      otpCodes.delete(email);
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
      storedOtp.attempts += 1;
      const attemptsRemaining = OTP_MAX_ATTEMPTS - storedOtp.attempts;
      console.error(`❌ 2FA failed - invalid code for: ${email} (${attemptsRemaining} attempts remaining)`);
      console.groupEnd();
      return res.status(400).json({ 
        message: 'Invalid verification code',
        attemptsRemaining 
      });
    }
    
    // Success - clear OTP
    otpCodes.delete(email);
    
    const user = users.get(email);
    
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
        companyName: user.companyName,
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
 * Admin Login Endpoint
 * POST /api/admin/login
 */
app.post('/api/admin/login', async (req, res) => {
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
    const admin = adminUsers.get(email);
    console.log(`ADMIN lookup: ${admin ? 'Found' : 'Not found'}`);
    
    if (!admin) {
      console.warn(`❌ ADMIN login failed - user not found: ${email}`);
      console.groupEnd();
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    // Verify password
    const passwordValid = admin.password === password; // TODO: Use bcrypt.compare in production
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
process.on('SIGTERM', () => {
  console.log('\n⚠️ SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️ SIGINT received, shutting down gracefully...');
  process.exit(0);
});
