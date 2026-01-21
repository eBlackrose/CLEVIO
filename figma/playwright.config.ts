import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for CLEVIO
 * 
 * Tests Tier 1 Production Readiness:
 * - Auth & Session Management
 * - Company Profile CRUD
 * - Team Management (Employees/Contractors)
 * - Subscriptions & Business Rules
 * - AMEX Integration
 * - Payroll Flow & Billing History
 * - Advisory Scheduling
 * - Security & Authorization
 */

export default defineConfig({
  testDir: './e2e',
  
  // Run tests in parallel
  fullyParallel: false, // Sequential for now to avoid DB conflicts
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Single worker for local dev to avoid DB conflicts
  workers: 1,
  
  // Reporter to use
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL for all tests
    baseURL: 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run backend server before starting the tests
  webServer: [
    {
      command: 'cd server && ENABLE_TEST_ROUTES=true npm run dev',
      url: 'http://localhost:3001/api/health',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        ENABLE_TEST_ROUTES: 'true',
        EMAIL_MODE: 'log',
      }
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],
});
