/**
 * Test Utilities for JWT Authentication
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a test user in the database
 */
export async function createTestUser(
  email: string, 
  options: {
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'user' | 'admin';
    verified?: boolean;
  } = {}
) {
  const {
    password = 'Test123!',
    firstName = 'Test',
    lastName = 'User',
    role = 'user',
    verified = true
  } = options;

  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      verified
    }
  });
  
  return user;
}

/**
 * Generate a JWT token for testing
 */
export function generateTestToken(
  userId: string, 
  email: string, 
  role: string = 'user'
): string {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
}

/**
 * Create a test user with company
 */
export async function createTestUserWithCompany(email: string, companyName: string = 'Test Company') {
  const user = await createTestUser(email);
  
  const company = await prisma.company.create({
    data: {
      name: companyName,
      ownerId: user.id
    }
  });
  
  const token = generateTestToken(user.id, user.email, user.role);
  
  return { user, company, token };
}

/**
 * Create a test user with token (convenience function)
 */
export async function createTestUserWithToken(
  email: string,
  options?: Parameters<typeof createTestUser>[1]
) {
  const user = await createTestUser(email, options);
  const token = generateTestToken(user.id, user.email, user.role);
  return { user, token };
}

/**
 * Create an admin user with token
 */
export async function createTestAdmin(email: string = 'admin@test.com') {
  const user = await createTestUser(email, { role: 'admin' });
  const token = generateTestToken(user.id, user.email, user.role);
  return { user, token };
}

/**
 * Create an OTP code for a user
 */
export async function createTestOTP(email: string, code: string = '123456') {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  return await prisma.oTPCode.create({
    data: {
      email,
      code,
      expiresAt,
      attempts: 0
    }
  });
}

/**
 * Clean up test data for a user
 */
export async function cleanupTestUser(email: string) {
  // Delete in correct order due to foreign keys
  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: true }
  });
  
  if (user?.company) {
    await prisma.billingHistory.deleteMany({ where: { companyId: user.company.id } });
    await prisma.advisorySession.deleteMany({ where: { companyId: user.company.id } });
    await prisma.amexCard.deleteMany({ where: { companyId: user.company.id } });
    await prisma.payrollSchedule.deleteMany({ where: { companyId: user.company.id } });
    await prisma.subscription.deleteMany({ where: { companyId: user.company.id } });
    await prisma.notificationPreferences.deleteMany({ where: { companyId: user.company.id } });
    await prisma.employee.deleteMany({ where: { companyId: user.company.id } });
    await prisma.company.delete({ where: { id: user.company.id } });
  }
  
  await prisma.oTPCode.deleteMany({ where: { email } });
  await prisma.user.delete({ where: { email } });
}
