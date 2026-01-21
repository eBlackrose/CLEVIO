/**
 * Jest test setup
 * Runs before all tests
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Clean up database before all tests
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.EMAIL_MODE = 'log';
  process.env.OTP_EXP_MINUTES = '10';
  process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
  
  // Clear test data
  await prisma.otpCode.deleteMany();
  await prisma.billingHistory.deleteMany();
  await prisma.advisorySession.deleteMany();
  await prisma.payrollSchedule.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
});

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Reset database between test suites
afterEach(async () => {
  // Optional: clear data between tests for isolation
  // Comment out if tests should build on each other
});
