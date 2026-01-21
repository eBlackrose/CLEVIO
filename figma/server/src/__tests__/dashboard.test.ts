/**
 * Dashboard API Tests
 * Tests company, team, subscriptions, payroll, and advisory endpoints
 */

import request from 'supertest';
import { app } from '../server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Dashboard API', () => {
  let authUserId: number;
  let authEmail = 'dashboard-test@example.com';

  // Helper to create and authenticate a user
  beforeAll(async () => {
    // Signup user
    await request(app).post('/api/user/signup').send({
      email: authEmail,
      password: 'DashTest123',
      companyName: 'Dashboard Test Co'
    });

    // Get OTP and verify
    const otp = await prisma.oTPCode.findFirst({
      where: { email: authEmail },
      orderBy: { createdAt: 'desc' }
    });

    const verifyRes = await request(app)
      .post('/api/user/verify-2fa')
      .send({
        email: authEmail,
        code: otp?.code
      });

    authUserId = verifyRes.body.user.id;
  });

  describe('GET /api/user/me', () => {
    it('should return complete user profile', async () => {
      const res = await request(app)
        .get('/api/user/me')
        .query({ email: authEmail })
        .expect(200);

      expect(res.body.email).toBe(authEmail);
      expect(res.body.company).toBeTruthy();
      expect(res.body.employees).toEqual([]);
      expect(res.body.subscriptions).toEqual([]);
    });

    it('should return 401 for unauthenticated request', async () => {
      const res = await request(app)
        .get('/api/user/me')
        .expect(401);

      expect(res.body.error).toBeTruthy();
    });
  });

  describe('Company Profile API', () => {
    describe('GET /api/company', () => {
      it('should return company profile', async () => {
        const res = await request(app)
          .get('/api/company')
          .query({ email: authEmail })
          .expect(200);

        expect(res.body.company).toBeTruthy();
        expect(res.body.company.name).toBe('Dashboard Test Co');
      });
    });

    describe('PUT /api/company', () => {
      it('should update company profile', async () => {
        const updateData = {
          ein: '12-3456789',
          industry: 'Technology',
          employeeCount: '10-50',
          annualRevenue: '$1M-$5M'
        };

        const res = await request(app)
          .put('/api/company')
          .query({ email: authEmail })
          .send(updateData)
          .expect(200);

        expect(res.body.company.ein).toBe(updateData.ein);
        expect(res.body.company.industry).toBe(updateData.industry);
      });

      it('should validate EIN format', async () => {
        const res = await request(app)
          .put('/api/company')
          .query({ email: authEmail })
          .send({ ein: 'invalid-ein' })
          .expect(400);

        expect(res.body.error).toMatch(/EIN|format/i);
      });
    });
  });

  describe('Team Management API', () => {
    describe('POST /api/team', () => {
      it('should add employee', async () => {
        const employee = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'Software Engineer',
          department: 'Engineering',
          employmentType: 'full-time',
          salary: 100000,
          startDate: '2024-01-01'
        };

        const res = await request(app)
          .post('/api/team')
          .query({ email: authEmail })
          .send(employee)
          .expect(200);

        expect(res.body.employee.firstName).toBe(employee.firstName);
        expect(res.body.employee.email).toBe(employee.email);
      });

      it('should validate required fields', async () => {
        const res = await request(app)
          .post('/api/team')
          .query({ email: authEmail })
          .send({ firstName: 'Jane' }) // Missing required fields
          .expect(400);

        expect(res.body.error).toBeTruthy();
      });

      it('should handle SSN (store only last4)', async () => {
        const employee = {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'Designer',
          employmentType: 'full-time',
          salary: 90000,
          ssn: '123-45-6789'
        };

        const res = await request(app)
          .post('/api/team')
          .query({ email: authEmail })
          .send(employee)
          .expect(200);

        // Should store only last4
        expect(res.body.employee.ssnLast4).toBe('6789');
        expect(res.body.employee.ssn).toBeUndefined();
      });
    });

    describe('GET /api/team', () => {
      it('should list all team members', async () => {
        const res = await request(app)
          .get('/api/team')
          .query({ email: authEmail })
          .expect(200);

        expect(Array.isArray(res.body.employees)).toBe(true);
        expect(res.body.employees.length).toBeGreaterThan(0);
      });
    });

    describe('PUT /api/team/:id', () => {
      it('should update employee', async () => {
        // Get existing employee
        const listRes = await request(app)
          .get('/api/team')
          .query({ email: authEmail });
        
        const employeeId = listRes.body.employees[0].id;

        const res = await request(app)
          .put(`/api/team/${employeeId}`)
          .query({ email: authEmail })
          .send({ salary: 110000 })
          .expect(200);

        expect(res.body.employee.salary).toBe(110000);
      });
    });

    describe('DELETE /api/team/:id', () => {
      it('should delete employee', async () => {
        // Create employee to delete
        const createRes = await request(app)
          .post('/api/team')
          .query({ email: authEmail })
          .send({
            firstName: 'ToDelete',
            lastName: 'User',
            email: 'delete@example.com',
            role: 'Temp',
            employmentType: 'contractor',
            salary: 50000
          });

        const employeeId = createRes.body.employee.id;

        const res = await request(app)
          .delete(`/api/team/${employeeId}`)
          .query({ email: authEmail })
          .expect(200);

        expect(res.body.message).toMatch(/deleted|removed/i);
      });
    });
  });

  describe('Subscriptions API', () => {
    describe('GET /api/subscriptions', () => {
      it('should return subscription status', async () => {
        const res = await request(app)
          .get('/api/subscriptions')
          .query({ email: authEmail })
          .expect(200);

        expect(res.body.subscriptions).toBeTruthy();
        expect(Array.isArray(res.body.subscriptions)).toBe(true);
      });
    });

    describe('PUT /api/subscriptions', () => {
      it('should enable payroll tier', async () => {
        const res = await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({
            tier: 'payroll',
            active: true
          })
          .expect(200);

        expect(res.body.subscription.tier).toBe('payroll');
        expect(res.body.subscription.active).toBe(true);
        expect(res.body.subscription.rate).toBe(2.5);
      });

      it('should enforce 6-month commitment for payroll', async () => {
        // Enable payroll
        await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({ tier: 'payroll', active: true });

        // Try to disable immediately
        const res = await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({ tier: 'payroll', active: false })
          .expect(400);

        expect(res.body.error).toMatch(/commitment|6 month/i);
      });

      it('should calculate total monthly rate', async () => {
        // Enable all tiers
        await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({ tier: 'payroll', active: true });

        await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({ tier: 'tax', active: true });

        await request(app)
          .put('/api/subscriptions')
          .query({ email: authEmail })
          .send({ tier: 'advisory', active: true });

        const res = await request(app)
          .get('/api/subscriptions')
          .query({ email: authEmail });

        const totalRate = res.body.subscriptions
          .filter((s: any) => s.active)
          .reduce((sum: number, s: any) => sum + s.rate, 0);

        expect(totalRate).toBe(6.5); // 2.5 + 2.0 + 2.0
      });
    });
  });

  describe('Payroll API', () => {
    describe('GET /api/payroll/schedule', () => {
      it('should return payroll schedule', async () => {
        const res = await request(app)
          .get('/api/payroll/schedule')
          .query({ email: authEmail })
          .expect(200);

        expect(res.body.schedule).toBeTruthy();
      });
    });

    describe('PUT /api/payroll/schedule', () => {
      it('should update payroll schedule', async () => {
        const scheduleData = {
          frequency: 'bi-weekly',
          dayOfMonth: 15,
          autoRun: true
        };

        const res = await request(app)
          .put('/api/payroll/schedule')
          .query({ email: authEmail })
          .send(scheduleData)
          .expect(200);

        expect(res.body.schedule.frequency).toBe(scheduleData.frequency);
        expect(res.body.schedule.dayOfMonth).toBe(scheduleData.dayOfMonth);
      });
    });

    describe('POST /api/payroll/run', () => {
      it('should block payroll if team < 5', async () => {
        const res = await request(app)
          .post('/api/payroll/run')
          .query({ email: authEmail })
          .expect(400);

        expect(res.body.error).toMatch(/5 team members|minimum/i);
      });

      it('should block payroll if AMEX not connected', async () => {
        // Add 5 team members first
        for (let i = 0; i < 5; i++) {
          await request(app)
            .post('/api/team')
            .query({ email: authEmail })
            .send({
              firstName: `Employee${i}`,
              lastName: 'Test',
              email: `emp${i}@example.com`,
              role: 'Worker',
              employmentType: 'full-time',
              salary: 50000
            });
        }

        const res = await request(app)
          .post('/api/payroll/run')
          .query({ email: authEmail })
          .expect(400);

        expect(res.body.error).toMatch(/AMEX|payment method/i);
      });
    });
  });

  describe('Advisory API', () => {
    describe('GET /api/advisory', () => {
      it('should return advisory sessions', async () => {
        const res = await request(app)
          .get('/api/advisory')
          .query({ email: authEmail })
          .expect(200);

        expect(Array.isArray(res.body.sessions)).toBe(true);
      });
    });

    describe('POST /api/advisory', () => {
      it('should block if team < 5', async () => {
        const res = await request(app)
          .post('/api/advisory')
          .query({ email: authEmail })
          .send({
            date: '2024-12-01',
            time: '10:00',
            topic: 'Tax Planning'
          })
          .expect(400);

        expect(res.body.error).toMatch(/5 team members|unlock/i);
      });

      it('should block if no tax/advisory tier active', async () => {
        // This test assumes we have 5+ team members from previous tests
        // but no tax/advisory tier is active
        
        const res = await request(app)
          .post('/api/advisory')
          .query({ email: authEmail })
          .send({
            date: '2024-12-01',
            time: '10:00',
            topic: 'Advisory Session'
          })
          .expect(400);

        expect(res.body.error).toMatch(/tier|subscription/i);
      });
    });
  });

  describe('Payments API', () => {
    describe('GET /api/payments/amex', () => {
      it('should return AMEX card status', async () => {
        const res = await request(app)
          .get('/api/payments/amex')
          .query({ email: authEmail })
          .expect(200);

        expect(res.body).toHaveProperty('connected');
      });
    });

    describe('POST /api/payments/amex', () => {
      it('should connect AMEX card (placeholder)', async () => {
        const cardData = {
          cardholderName: 'John Doe',
          last4: '1234',
          expiryMonth: 12,
          expiryYear: 2025
        };

        const res = await request(app)
          .post('/api/payments/amex')
          .query({ email: authEmail })
          .send(cardData)
          .expect(200);

        expect(res.body.card.last4).toBe(cardData.last4);
      });
    });
  });

  describe('Billing History API', () => {
    describe('GET /api/billing/history', () => {
      it('should return billing history', async () => {
        const res = await request(app)
          .get('/api/billing/history')
          .query({ email: authEmail })
          .expect(200);

        expect(Array.isArray(res.body.history)).toBe(true);
      });
    });
  });
});
