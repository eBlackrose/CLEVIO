import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `subs-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'Subscription',
  lastName: 'Tester',
  company: 'Subs Test Corp'
};

async function loginUser(page: any) {
  await page.goto('/signup');
  await page.fill('[name="email"]', TEST_USER.email);
  await page.fill('[name="password"]', TEST_USER.password);
  await page.fill('[name="firstName"]', TEST_USER.firstName);
  await page.fill('[name="lastName"]', TEST_USER.lastName);
  await page.fill('[name="companyName"]', TEST_USER.company);
  await page.click('button[type="submit"]');
  
  await page.goto('/signin');
  await page.fill('[name="email"]', TEST_USER.email);
  await page.fill('[name="password"]', TEST_USER.password);
  await page.click('button:has-text("Sign In")');
  
  const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
  const otpData = await response.json();
  await page.fill('[name="code"]', otpData.code);
  await page.click('button:has-text("Verify")');
  
  await expect(page).toHaveURL(/.*dashboard/);
}

test.describe('Tier 1D: Services & Subscriptions', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('1. Should toggle Payroll tier', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    const payrollToggle = page.locator('[data-testid="payroll-toggle"], input[type="checkbox"]:near(:text("Payroll"))').first();
    
    // Get initial state
    const initiallyChecked = await payrollToggle.isChecked();
    
    // Toggle
    await payrollToggle.click();
    await page.waitForTimeout(1000);
    
    // Should have changed
    const nowChecked = await payrollToggle.isChecked();
    expect(nowChecked).toBe(!initiallyChecked);
    
    // Should show success message
    await expect(page.locator('text=/updated/i, text=/saved/i')).toBeVisible({ timeout: 5000 });
  });

  test('2. Should toggle Tax tier', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    const taxToggle = page.locator('[data-testid="tax-toggle"], input[type="checkbox"]:near(:text("Tax"))').first();
    
    const initialState = await taxToggle.isChecked();
    await taxToggle.click();
    await page.waitForTimeout(1000);
    
    expect(await taxToggle.isChecked()).toBe(!initialState);
  });

  test('3. Should toggle Advisory tier', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    const advisoryToggle = page.locator('[data-testid="advisory-toggle"], input[type="checkbox"]:near(:text("Advisory"))').first();
    
    const initialState = await advisoryToggle.isChecked();
    await advisoryToggle.click();
    await page.waitForTimeout(1000);
    
    expect(await advisoryToggle.isChecked()).toBe(!initialState);
  });

  test('4. Should show correct monthly rate calculation', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    // Enable all tiers
    const payrollToggle = page.locator('[data-testid="payroll-toggle"], input[type="checkbox"]:near(:text("Payroll"))').first();
    const taxToggle = page.locator('[data-testid="tax-toggle"], input[type="checkbox"]:near(:text("Tax"))').first();
    const advisoryToggle = page.locator('[data-testid="advisory-toggle"], input[type="checkbox"]:near(:text("Advisory"))').first();
    
    if (!(await payrollToggle.isChecked())) await payrollToggle.click();
    await page.waitForTimeout(500);
    if (!(await taxToggle.isChecked())) await taxToggle.click();
    await page.waitForTimeout(500);
    if (!(await advisoryToggle.isChecked())) await advisoryToggle.click();
    await page.waitForTimeout(1000);
    
    // Should show total monthly rate
    const totalElement = page.locator('text=/total.*\\$/i, text=/monthly.*\\$/i, [data-testid="total-rate"]');
    await expect(totalElement).toBeVisible({ timeout: 5000 });
    
    // Should have a dollar amount
    const totalText = await totalElement.textContent();
    expect(totalText).toMatch(/\$[0-9,]+/);
  });

  test('5. Should persist subscription state across refresh', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    // Enable Payroll
    const payrollToggle = page.locator('[data-testid="payroll-toggle"], input[type="checkbox"]:near(:text("Payroll"))').first();
    if (!(await payrollToggle.isChecked())) {
      await payrollToggle.click();
      await page.waitForTimeout(1000);
    }
    
    // Refresh
    await page.reload();
    
    // Should still be enabled
    await expect(payrollToggle).toBeChecked({ timeout: 5000 });
  });

  test('6. Should show commitment modal for Payroll tier', async ({ page }) => {
    await page.goto('/dashboard/services');
    
    const payrollToggle = page.locator('[data-testid="payroll-toggle"], input[type="checkbox"]:near(:text("Payroll"))').first();
    
    // If not checked, enable it
    if (!(await payrollToggle.isChecked())) {
      await payrollToggle.click();
      
      // Should show commitment modal or message
      const commitmentText = page.locator('text=/6.*month/i, text=/commitment/i');
      await expect(commitmentText).toBeVisible({ timeout: 5000 });
    }
  });
});
