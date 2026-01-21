import { test, expect } from '@playwright/test';

const API_URL = 'http://localhost:3001';
const TEST_USER = {
  email: `advisory-${Date.now()}@clevio.test`,
  password: 'SecurePass123!',
  firstName: 'Advisory',
  lastName: 'User',
  company: 'Advisory Test LLC'
};

async function setupUserForAdvisory(page: any) {
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
  
  // Add 5 team members
  await page.goto('/dashboard/employees');
  for (let i = 1; i <= 5; i++) {
    await page.click('button:has-text("Add Employee")');
    await page.fill('[name="fullName"], [name="name"]', `Advisory Team ${i}`);
    await page.fill('[name="email"]', `adv-team${i}-${Date.now()}@test.com`);
    await page.fill('[name="salary"]', '70000');
    await page.fill('[name="accountLast4"]', `${i}${i}${i}${i}`);
    await page.fill('[name="ssnLast4"]', `${i+2}${i+2}${i+2}${i+2}`);
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
  }
  
  // Enable Tax or Advisory tier
  await page.goto('/dashboard/services');
  const advisoryToggle = page.locator('[data-testid="advisory-toggle"], input[type="checkbox"]:near(:text("Advisory"))').first();
  if (!(await advisoryToggle.isChecked())) {
    await advisoryToggle.click();
    await page.waitForTimeout(1000);
  }
}

test.describe('Tier 1G: Advisory Sessions', () => {
  
  test('1. Should show locked state without requirements', async ({ page }) => {
    // Login without full setup
    await page.goto('/signup');
    await page.fill('[name="email"]', `locked-adv-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.fill('[name="firstName"]', 'Locked');
    await page.fill('[name="lastName"]', 'Advisory');
    await page.fill('[name="companyName"]', 'Locked Advisory Co');
    await page.click('button[type="submit"]');
    
    await page.goto('/signin');
    await page.fill('[name="email"]', `locked-adv-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.click('button:has-text("Sign In")');
    
    const otpResp = await fetch(`${API_URL}/api/test/otp?email=locked-adv-${Date.now()}@test.com`);
    if (otpResp.ok) {
      const otpData = await otpResp.json();
      await page.fill('[name="code"]', otpData.code);
      await page.click('button:has-text("Verify")');
    }
    
    await page.goto('/dashboard/advisory');
    
    // Should show locked state
    await expect(page.locator('text=/locked/i, text=/requirements/i, text=/upgrade/i')).toBeVisible({ timeout: 5000 });
  });

  test('2. Should unlock advisory when requirements met', async ({ page }) => {
    await setupUserForAdvisory(page);
    
    await page.goto('/dashboard/advisory');
    
    // Should NOT show locked state
    await expect(page.locator('text=/schedule/i, button:has-text("Book Session"), button:has-text("Schedule")')).toBeVisible({ timeout: 10000 });
  });

  test('3. Should schedule advisory session', async ({ page }) => {
    await setupUserForAdvisory(page);
    
    await page.goto('/dashboard/advisory');
    
    // Click schedule button
    await page.click('button:has-text("Schedule"), button:has-text("Book Session"), button:has-text("New Session")');
    
    // Fill session details
    const topicInput = page.locator('[name="topic"], [name="title"], [name="subject"]');
    if (await topicInput.count() > 0) {
      await topicInput.fill('Tax Planning Discussion');
    }
    
    // Select date (if date picker exists)
    const dateInput = page.locator('[name="date"], input[type="date"]');
    if (await dateInput.count() > 0) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      await dateInput.fill(futureDate.toISOString().split('T')[0]);
    }
    
    // Save
    await page.click('button:has-text("Book"), button:has-text("Schedule"), button:has-text("Save")');
    
    // Should show success
    await expect(page.locator('text=/scheduled/i, text=/booked/i, text=/created/i')).toBeVisible({ timeout: 5000 });
  });

  test('4. Should show advisory sessions in list', async ({ page }) => {
    await setupUserForAdvisory(page);
    
    await page.goto('/dashboard/advisory');
    
    // Schedule a session
    await page.click('button:has-text("Schedule"), button:has-text("Book")');
    const topicInput = page.locator('[name="topic"], [name="title"]');
    if (await topicInput.count() > 0) {
      await topicInput.fill('E2E Test Session');
      await page.click('button:has-text("Book"), button:has-text("Save")');
      await page.waitForTimeout(2000);
    }
    
    // Should appear in list
    await expect(page.locator('text="E2E Test Session", tr:has-text("E2E Test Session")')).toBeVisible({ timeout: 5000 });
  });

  test('5. Should persist advisory sessions', async ({ page }) => {
    await setupUserForAdvisory(page);
    
    await page.goto('/dashboard/advisory');
    
    // Schedule session
    await page.click('button:has-text("Schedule"), button:has-text("Book")');
    const topicInput = page.locator('[name="topic"], [name="title"]');
    if (await topicInput.count() > 0) {
      const sessionName = `Persistent Session ${Date.now()}`;
      await topicInput.fill(sessionName);
      await page.click('button:has-text("Book")');
      await page.waitForTimeout(1000);
      
      // Refresh
      await page.reload();
      
      // Should still be there
      await expect(page.locator(`text="${sessionName}"`)).toBeVisible({ timeout: 5000 });
    }
  });

  test('6. Should enforce team size + tier requirement', async ({ page }) => {
    // Create user with only 3 team members and no advisory tier
    await page.goto('/signup');
    await page.fill('[name="email"]', `req-test-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.fill('[name="firstName"]', 'Req');
    await page.fill('[name="lastName"]', 'Test');
    await page.fill('[name="companyName"]', 'Req Test');
    await page.click('button[type="submit"]');
    
    await page.goto('/signin');
    await page.fill('[name="email"]', `req-test-${Date.now()}@test.com`);
    await page.fill('[name="password"]', 'Test123!');
    await page.click('button:has-text("Sign In")');
    
    const resp = await fetch(`${API_URL}/api/test/otp?email=req-test-${Date.now()}@test.com`);
    if (resp.ok) {
      const data = await resp.json();
      await page.fill('[name="code"]', data.code);
      await page.click('button:has-text("Verify")');
    }
    
    // Add only 3 employees
    await page.goto('/dashboard/employees');
    for (let i = 1; i <= 3; i++) {
      await page.click('button:has-text("Add Employee")');
      await page.fill('[name="fullName"]', `Employee ${i}`);
      await page.fill('[name="email"]', `emp${i}@test.com`);
      await page.fill('[name="salary"]', '60000');
      await page.fill('[name="accountLast4"]', '1111');
      await page.fill('[name="ssnLast4"]', '2222');
      await page.click('button:has-text("Save")');
      await page.waitForTimeout(300);
    }
    
    await page.goto('/dashboard/advisory');
    
    // Should show locked state with clear requirements
    await expect(page.locator('text=/minimum.*5/i, text=/upgrade.*tier/i, text=/locked/i')).toBeVisible({ timeout: 5000 });
  });
});
