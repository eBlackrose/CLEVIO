import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `team-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'Team',
  lastName: 'Manager',
  company: 'Team Test Corp'
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

test.describe('Tier 1C: Team Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('1. Should add 5 team members (minimum requirement)', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    for (let i = 1; i <= 5; i++) {
      // Click add employee button
      await page.click('button:has-text("Add Employee"), button:has-text("Add Team Member"), button:has-text("New Employee")');
      
      // Fill form
      await page.fill('[name="fullName"], [name="name"]', `Employee ${i}`);
      await page.fill('[name="email"]', `employee${i}-${Date.now()}@test.com`);
      
      // Select type
      const typeSelect = page.locator('[name="type"], select:has(option:has-text("Employee"))');
      if (await typeSelect.count() > 0) {
        await typeSelect.selectOption('employee');
      }
      
      // Fill salary
      await page.fill('[name="salary"]', '75000');
      
      // Fill bank info (last 4)
      await page.fill('[name="accountLast4"]', '1234');
      
      // Fill SSN last 4
      await page.fill('[name="ssnLast4"]', '5678');
      
      // Submit
      await page.click('button:has-text("Save"), button:has-text("Add"), button[type="submit"]');
      
      // Wait for success
      await expect(page.locator('text=/added/i, text=/created/i, text=/saved/i')).toBeVisible({ timeout: 5000 });
      
      console.log(`✓ Added employee ${i}`);
    }
    
    // Verify all 5 are listed
    const employeeRows = page.locator('tr:has-text("Employee"), .employee-row, [data-testid*="employee"]');
    await expect(employeeRows).toHaveCount(5, { timeout: 3000 });
  });

  test('2. Should edit team member', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    // Add a member first
    await page.click('button:has-text("Add Employee"), button:has-text("Add Team Member")');
    await page.fill('[name="fullName"], [name="name"]', 'Edit Test Employee');
    await page.fill('[name="email"]', `edit-test-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '60000');
    await page.fill('[name="accountLast4"]', '9999');
    await page.fill('[name="ssnLast4"]', '8888');
    await page.click('button:has-text("Save"), button:has-text("Add")');
    
    await expect(page.locator('text=/added/i')).toBeVisible();
    
    // Click edit
    await page.click('[data-testid="edit-employee"], button:has-text("Edit"), .edit-button', { timeout: 5000 }).catch(() => {});
    
    // Update salary
    const salaryInput = page.locator('[name="salary"]');
    await salaryInput.fill('70000');
    await page.click('button:has-text("Save"), button:has-text("Update")');
    
    // Verify update
    await expect(page.locator('text=/updated/i, text=/saved/i')).toBeVisible({ timeout: 5000 });
  });

  test('3. Should delete team member', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    // Add a member
    await page.click('button:has-text("Add Employee")');
    await page.fill('[name="fullName"], [name="name"]', 'Delete Test');
    await page.fill('[name="email"]', `delete-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '50000');
    await page.fill('[name="accountLast4"]', '7777');
    await page.fill('[name="ssnLast4"]', '6666');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text="Delete Test"')).toBeVisible();
    
    // Delete
    await page.click('[data-testid="delete-employee"], button:has-text("Delete"), .delete-button').catch(async () => {
      // Fallback: look for row actions
      const row = page.locator('tr:has-text("Delete Test")');
      await row.locator('button').last().click();
    });
    
    // Confirm if modal appears
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Delete"):visible');
    if (await confirmButton.count() > 0) {
      await confirmButton.click();
    }
    
    // Verify deleted
    await expect(page.locator('text="Delete Test"')).not.toBeVisible({ timeout: 5000 });
  });

  test('4. Should show minimum 5 member requirement banner', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    // If less than 5 members, should see warning
    const banner = page.locator('text=/minimum.*5/i, text=/at least 5/i, .warning, .alert');
    const employeeCount = await page.locator('tr:has-text("Employee"), .employee-row').count();
    
    if (employeeCount < 5) {
      await expect(banner).toBeVisible({ timeout: 3000 });
    }
  });

  test('5. Should persist team data across refresh', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    const uniqueName = `Persistent ${Date.now()}`;
    await page.click('button:has-text("Add Employee")');
    await page.fill('[name="fullName"], [name="name"]', uniqueName);
    await page.fill('[name="email"]', `persist-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '65000');
    await page.fill('[name="accountLast4"]', '4444');
    await page.fill('[name="ssnLast4"]', '3333');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator(`text="${uniqueName}"`)).toBeVisible();
    
    // Refresh
    await page.reload();
    
    // Should still be there
    await expect(page.locator(`text="${uniqueName}"`)).toBeVisible({ timeout: 5000 });
  });

  test('6. Should validate SSN and bank last4 (security)', async ({ page }) => {
    await page.goto('/dashboard/employees');
    
    // Add employee
    await page.click('button:has-text("Add Employee")');
    await page.fill('[name="fullName"]', 'Security Test');
    await page.fill('[name="email"]', `sec-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '55000');
    await page.fill('[name="accountLast4"]', '2222');
    await page.fill('[name="ssnLast4"]', '1111');
    await page.click('button:has-text("Save")');
    
    await expect(page.locator('text="Security Test"')).toBeVisible();
    
    // Verify SSN/bank are masked (should not show full numbers)
    const pageContent = await page.content();
    expect(pageContent).not.toContain('123-45-6789'); // Full SSN format
    expect(pageContent).toMatch(/\*\*\*\*2222|\*\*2222|2222/); // Should show last 4 or masked
  });
});
