import { test, expect, Page } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `e2e-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'E2E',
  lastName: 'Tester',
  company: 'E2E Test Corp'
};

let authToken: string;
let otpCode: string;

test.describe('Tier 1A: Authentication & Session', () => {
  
  test('1. Should signup successfully', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill signup form
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.fill('[name="firstName"]', TEST_USER.firstName);
    await page.fill('[name="lastName"]', TEST_USER.lastName);
    await page.fill('[name="companyName"]', TEST_USER.company);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to signin with success message
    await expect(page).toHaveURL(/.*signin/);
    await expect(page.locator('text=/account created/i')).toBeVisible({ timeout: 10000 });
  });

  test('2. Should login and trigger OTP', async ({ page }) => {
    await page.goto('/signin');
    
    // Enter credentials
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Should show OTP input
    await expect(page.locator('[name="code"]')).toBeVisible({ timeout: 10000 });
    
    // Retrieve OTP from test endpoint
    const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
    const otpData = await response.json();
    otpCode = otpData.code;
    
    console.log(`✓ OTP retrieved: ${otpCode}`);
    expect(otpCode).toMatch(/^\d{6}$/);
  });

  test('3. Should verify OTP and login', async ({ page }) => {
    await page.goto('/signin');
    
    // Login
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    // Get OTP
    const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
    const otpData = await response.json();
    
    // Enter OTP
    await page.fill('[name="code"]', otpData.code);
    await page.click('button:has-text("Verify")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    
    // Verify user data in localStorage
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeTruthy();
    authToken = token!;
    
    console.log(`✓ Logged in successfully, token stored`);
  });

  test('4. Should protect dashboard routes without auth', async ({ page, context }) => {
    // Clear all storage
    await context.clearCookies();
    await page.goto('/dashboard/overview');
    
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to access dashboard
    await page.goto('/dashboard/overview');
    
    // Should redirect to signin
    await expect(page).toHaveURL(/.*signin/, { timeout: 5000 });
  });

  test('5. Should persist session across page refresh', async ({ page }) => {
    // Login first
    await page.goto('/signin');
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
    const otpData = await response.json();
    await page.fill('[name="code"]', otpData.code);
    await page.click('button:has-text("Verify")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Refresh page
    await page.reload();
    
    // Should still be on dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=/dashboard/i')).toBeVisible();
  });

  test('6. Should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/signin');
    await page.fill('[name="email"]', TEST_USER.email);
    await page.fill('[name="password"]', TEST_USER.password);
    await page.click('button:has-text("Sign In")');
    
    const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
    const otpData = await response.json();
    await page.fill('[name="code"]', otpData.code);
    await page.click('button:has-text("Verify")');
    
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Logout
    await page.click('[data-testid="logout"], button:has-text("Logout"), button:has-text("Sign Out")');
    
    // Should redirect to signin
    await expect(page).toHaveURL(/.*signin/, { timeout: 5000 });
    
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('authToken'));
    expect(token).toBeNull();
  });

  test('7. Should enforce rate limiting on auth endpoints', async ({ page }) => {
    await page.goto('/signin');
    
    // Try multiple failed login attempts
    for (let i = 0; i < 11; i++) {
      await page.fill('[name="email"]', 'wrong@email.com');
      await page.fill('[name="password"]', 'wrongpassword');
      await page.click('button:has-text("Sign In")');
      await page.waitForTimeout(500);
    }
    
    // Should see rate limit error
    await expect(page.locator('text=/too many/i, text=/rate limit/i')).toBeVisible({ timeout: 5000 });
  });
});
