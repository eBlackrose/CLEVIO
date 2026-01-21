/**
 * Authentication API Tests
 * Tests signup, login, OTP verification, and rate limiting
 */

import request from 'supertest';
import { app } from '../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'SecurePassword123!',
    companyName: 'Test Company Inc.'
  };

  describe('POST /api/user/signup', () => {
    it('should create a new user and send OTP', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send(testUser)
        .expect(200);

      expect(res.body.message).toMatch(/OTP sent/i);
      expect(res.body.email).toBe(testUser.email);

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      expect(user).toBeTruthy();
      expect(user?.email).toBe(testUser.email);
    });

    it('should reject duplicate email', async () => {
      // Create user first
      await request(app).post('/api/user/signup').send(testUser);

      // Try to create again
      const res = await request(app)
        .post('/api/user/signup')
        .send(testUser)
        .expect(400);

      expect(res.body.error).toMatch(/already exists|duplicate/i);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send({ email: 'test2@example.com' }) // Missing password
        .expect(400);

      expect(res.body.error).toBeTruthy();
    });

    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'invalid-email',
          password: 'password123',
          companyName: 'Test'
        })
        .expect(400);

      expect(res.body.error).toMatch(/email|invalid/i);
    });

    it('should hash password (not store plaintext)', async () => {
      const newUser = {
        email: 'hash-test@example.com',
        password: 'MySecurePassword123',
        companyName: 'Hash Test Co'
      };

      await request(app).post('/api/user/signup').send(newUser);

      const user = await prisma.user.findUnique({
        where: { email: newUser.email }
      });

      expect(user?.passwordHash).toBeTruthy();
      expect(user?.passwordHash).not.toBe(newUser.password);
      expect(user?.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt hash format
    });
  });

  describe('POST /api/user/login', () => {
    beforeAll(async () => {
      // Create and verify a user for login tests
      await request(app).post('/api/user/signup').send({
        email: 'login-test@example.com',
        password: 'LoginPass123',
        companyName: 'Login Test'
      });

      const otp = await prisma.otpCode.findFirst({
        where: { email: 'login-test@example.com' },
        orderBy: { createdAt: 'desc' }
      });

      await request(app).post('/api/user/verify-2fa').send({
        email: 'login-test@example.com',
        code: otp?.code
      });
    });

    it('should send OTP for valid credentials', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login-test@example.com',
          password: 'LoginPass123'
        })
        .expect(200);

      expect(res.body.message).toMatch(/OTP sent/i);

      // Verify OTP was created
      const otp = await prisma.otpCode.findFirst({
        where: { email: 'login-test@example.com' },
        orderBy: { createdAt: 'desc' }
      });
      expect(otp).toBeTruthy();
      expect(otp?.code).toHaveLength(6);
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login-test@example.com',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(res.body.error).toMatch(/invalid|credentials/i);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/user/verify-2fa', () => {
    let validOtp: string;

    beforeEach(async () => {
      // Create user and get OTP
      await request(app).post('/api/user/signup').send({
        email: 'otp-test@example.com',
        password: 'OtpTest123',
        companyName: 'OTP Test'
      });

      const otpRecord = await prisma.otpCode.findFirst({
        where: { email: 'otp-test@example.com' },
        orderBy: { createdAt: 'desc' }
      });
      validOtp = otpRecord?.code || '';
    });

    it('should verify valid OTP', async () => {
      const res = await request(app)
        .post('/api/user/verify-2fa')
        .send({
          email: 'otp-test@example.com',
          code: validOtp
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeTruthy();
      expect(res.body.user.email).toBe('otp-test@example.com');
    });

    it('should reject invalid OTP', async () => {
      const res = await request(app)
        .post('/api/user/verify-2fa')
        .send({
          email: 'otp-test@example.com',
          code: '000000'
        })
        .expect(401);

      expect(res.body.error).toMatch(/invalid|incorrect/i);
    });

    it('should increment attempts on wrong OTP', async () => {
      await request(app)
        .post('/api/user/verify-2fa')
        .send({
          email: 'otp-test@example.com',
          code: '111111'
        });

      const otpRecord = await prisma.otpCode.findFirst({
        where: { email: 'otp-test@example.com' },
        orderBy: { createdAt: 'desc' }
      });

      expect(otpRecord?.attempts).toBeGreaterThan(0);
    });

    it('should invalidate OTP after successful verification', async () => {
      await request(app)
        .post('/api/user/verify-2fa')
        .send({
          email: 'otp-test@example.com',
          code: validOtp
        });

      // Try to use same OTP again
      const res = await request(app)
        .post('/api/user/verify-2fa')
        .send({
          email: 'otp-test@example.com',
          code: validOtp
        })
        .expect(401);

      expect(res.body.error).toBeTruthy();
    });
  });

  describe('POST /api/user/resend-otp', () => {
    beforeEach(async () => {
      await request(app).post('/api/user/signup').send({
        email: 'resend-test@example.com',
        password: 'ResendTest123',
        companyName: 'Resend Test'
      });
    });

    it('should resend OTP for valid email', async () => {
      const res = await request(app)
        .post('/api/user/resend-otp')
        .send({ email: 'resend-test@example.com' })
        .expect(200);

      expect(res.body.message).toMatch(/OTP sent|resent/i);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/user/resend-otp')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);

      expect(res.body.error).toBeTruthy();
    });

    it('should enforce rate limiting', async () => {
      // First request should succeed
      await request(app)
        .post('/api/user/resend-otp')
        .send({ email: 'resend-test@example.com' })
        .expect(200);

      // Immediate second request should be rate limited
      const res = await request(app)
        .post('/api/user/resend-otp')
        .send({ email: 'resend-test@example.com' })
        .expect(429);

      expect(res.body.error).toMatch(/rate|too many|wait/i);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).toBe('healthy');
      expect(res.body.environment).toBeTruthy();
    });
  });
});
