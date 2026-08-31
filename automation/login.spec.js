const { test, expect } = require('@playwright/test');

test('Login page should display correctly', async ({ page }) => {

    await page.goto('http://localhost:5173/login?role=farmer');

    await expect(page.getByRole('heading', {
        name: 'Welcome Back'
    })).toBeVisible();

    await expect(page.locator('input[name="email"]')).toBeVisible();

    await expect(page.locator('input[name="password"]')).toBeVisible();

    await expect(page.getByRole('button', {
        name: 'Sign In'
    })).toBeVisible();
});


test('Login form should accept user credentials', async ({ page }) => {

    await page.goto('http://localhost:5173/login?role=farmer');

    await page.locator('input[name="email"]')
        .fill('test@example.com');

    await page.locator('input[name="password"]')
        .fill('TestPassword123');

    await expect(page.locator('input[name="email"]'))
        .toHaveValue('test@example.com');

    await expect(page.locator('input[name="password"]'))
        .toHaveValue('TestPassword123');
});