import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `company-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'Company',
  lastName: 'Tester',
  company: 'Test Company LLC'
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

test.describe('Tier 1B: Company Profile', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('1. Should view company profile', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Should see company name
    await expect(page.locator(`text="${TEST_USER.company}"`)).toBeVisible({ timeout: 10000 });
  });

  test('2. Should edit company details', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    const newCompanyName = `${TEST_USER.company} Updated`;
    const newEIN = '12-3456789';
    
    // Find and fill company name input
    const companyInput = page.locator('[name="companyName"], [name="name"], input[value*="Test Company"]').first();
    await companyInput.fill(newCompanyName);
    
    // Fill EIN if field exists
    const einInput = page.locator('[name="ein"], [name="taxId"]');
    if (await einInput.count() > 0) {
      await einInput.first().fill(newEIN);
    }
    
    // Save
    await page.click('button:has-text("Save"), button:has-text("Update")');
    
    // Should show success message
    await expect(page.locator('text=/saved/i, text=/updated/i')).toBeVisible({ timeout: 5000 });
  });

  test('3. Should persist company data across refresh', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    const newCompanyName = `Persistent Co ${Date.now()}`;
    const companyInput = page.locator('[name="companyName"], [name="name"]').first();
    await companyInput.fill(newCompanyName);
    await page.click('button:has-text("Save"), button:has-text("Update")');
    
    await expect(page.locator('text=/saved/i, text=/updated/i')).toBeVisible();
    
    // Refresh
    await page.reload();
    
    // Data should persist
    await expect(companyInput).toHaveValue(newCompanyName);
  });

  test('4. Should validate required fields', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Clear company name
    const companyInput = page.locator('[name="companyName"], [name="name"]').first();
    await companyInput.fill('');
    await page.click('button:has-text("Save"), button:has-text("Update")');
    
    // Should show validation error
    await expect(page.locator('text=/required/i, text=/cannot be empty/i')).toBeVisible({ timeout: 3000 });
  });
});
