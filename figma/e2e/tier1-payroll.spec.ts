import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `payroll-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'Payroll',
  lastName: 'Manager',
  company: 'Payroll Test Inc'
};

async function setupUserWithRequirements(page: any) {
  // Signup
  await page.goto('/signup');
  await page.fill('[name="email"]', TEST_USER.email);
  await page.fill('[name="password"]', TEST_USER.password);
  await page.fill('[name="firstName"]', TEST_USER.firstName);
  await page.fill('[name="lastName"]', TEST_USER.lastName);
  await page.fill('[name="companyName"]', TEST_USER.company);
  await page.click('button[type="submit"]');
  
  // Login
  await page.goto('/signin');
  await page.fill('[name="email"]', TEST_USER.email);
  await page.fill('[name="password"]', TEST_USER.password);
  await page.click('button:has-text("Sign In")');
  
  const response = await fetch(`${API_URL}/api/test/otp?email=${encodeURIComponent(TEST_USER.email)}`);
  const otpData = await response.json();
  await page.fill('[name="code"]', otpData.code);
  await page.click('button:has-text("Verify")');
  
  await expect(page).toHaveURL(/.*dashboard/);
  
  // Add 5 employees
  await page.goto('/dashboard/employees');
  for (let i = 1; i <= 5; i++) {
    await page.click('button:has-text("Add Employee")');
    await page.fill('[name="fullName"], [name="name"]', `Payroll Employee ${i}`);
    await page.fill('[name="email"]', `payroll-emp${i}-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '60000');
    await page.fill('[name="accountLast4"]', `${i}${i}${i}${i}`);
    await page.fill('[name="ssnLast4"]', `${i+1}${i+1}${i+1}${i+1}`);
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
  }
  
  // Enable Payroll tier
  await page.goto('/dashboard/services');
  const payrollToggle = page.locator('[data-testid="payroll-toggle"], input[type="checkbox"]:near(:text("Payroll"))').first();
  if (!(await payrollToggle.isChecked())) {
    await payrollToggle.click();
    await page.waitForTimeout(1000);
  }
  
  // Connect AMEX
  await page.goto('/dashboard/payments');
  await page.click('button:has-text("Connect AMEX"), button:has-text("Link Card")').catch(() => {});
  const cardInput = page.locator('[name="cardLast4"], [name="last4"]');
  if (await cardInput.count() > 0) {
    await cardInput.fill('1234');
    await page.click('button:has-text("Save"), button:has-text("Connect")');
  }
}

test.describe('Tier 1F: Payroll Core Flow', () => {
  
  test('1. Should show locked state without requirements', async ({ page }) => {
    // Login without setup
    await page.goto('/signup');
    await page.fill('[name="email"]', `locked-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.fill('[name="firstName"]', 'Locked');
    await page.fill('[name="lastName"]', 'User');
    await page.fill('[name="companyName"]', 'Locked Co');
    await page.click('button[type="submit"]');
    
    await page.goto('/signin');
    await page.fill('[name="email"]', `locked-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.click('button:has-text("Sign In")');
    
    const response = await fetch(`${API_URL}/api/test/otp?email=locked-${Date.now()}@test.com`);
    if (response.ok) {
      const otpData = await response.json();
      await page.fill('[name="code"]', otpData.code);
      await page.click('button:has-text("Verify")');
    }
    
    await page.goto('/dashboard/payroll');
    
    // Should show locked state / requirements banner
    await expect(page.locator('text=/locked/i, text=/requirements/i, text=/minimum 5/i')).toBeVisible({ timeout: 5000 });
  });

  test('2. Should enable payroll after meeting requirements', async ({ page }) => {
    await setupUserWithRequirements(page);
    
    await page.goto('/dashboard/payroll');
    
    // Should NOT be locked
    await expect(page.locator('text=/run payroll/i, button:has-text("Run Payroll")')).toBeVisible({ timeout: 10000 });
  });

  test('3. Should configure payroll schedule', async ({ page }) => {
    await setupUserWithRequirements(page);
    
    await page.goto('/dashboard/payroll');
    
    // Configure schedule
    const frequencySelect = page.locator('[name="frequency"], select:has(option:has-text("Biweekly"))');
    if (await frequencySelect.count() > 0) {
      await frequencySelect.selectOption('biweekly');
      await page.click('button:has-text("Save Schedule")');
      await expect(page.locator('text=/saved/i')).toBeVisible({ timeout: 3000 });
    }
  });

  test('4. Should run payroll and create billing history', async ({ page }) => {
    await setupUserWithRequirements(page);
    
    await page.goto('/dashboard/payroll');
    
    // Click Run Payroll
    await page.click('button:has-text("Run Payroll"), button:has-text("Process Payroll")');
    
    // Should show confirmation modal with employee list
    await expect(page.locator('text=/confirm/i, text=/payees/i')).toBeVisible({ timeout: 5000 });
    
    // Confirm
    await page.click('button:has-text("Confirm"), button:has-text("Submit")');
    
    // Should show success toast
    await expect(page.locator('text=/success/i, text=/processed/i, text=/completed/i')).toBeVisible({ timeout: 10000 });
    
    // Navigate to billing history
    await page.goto('/dashboard/payments');
    
    // Should see new billing history entry
    await expect(page.locator('tr:has-text("Payroll"), .billing-row, [data-testid*="billing"]')).toBeVisible({ timeout: 5000 });
    
    console.log('✓ Payroll run created billing history entry');
  });

  test('5. Should show computed totals in payroll confirmation', async ({ page }) => {
    await setupUserWithRequirements(page);
    
    await page.goto('/dashboard/payroll');
    await page.click('button:has-text("Run Payroll")');
    
    // Modal should show total amount
    const modal = page.locator('.modal, [role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Should show dollar amount
    await expect(modal.locator('text=/\\$[0-9,]+/')).toBeVisible({ timeout: 3000 });
  });

  test('6. Should refresh UI after payroll submission', async ({ page }) => {
    await setupUserWithRequirements(page);
    
    await page.goto('/dashboard/payroll');
    
    // Get initial state
    const initialContent = await page.content();
    
    // Run payroll
    await page.click('button:has-text("Run Payroll")');
    await page.click('button:has-text("Confirm")');
    await expect(page.locator('text=/success/i')).toBeVisible();
    
    // Wait for UI update
    await page.waitForTimeout(2000);
    
    // Content should change (showing last run date or updated status)
    const updatedContent = await page.content();
    expect(updatedContent).not.toBe(initialContent);
  });
});
