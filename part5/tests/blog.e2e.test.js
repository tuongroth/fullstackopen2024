const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    // Replace the URL with your app's local development URL
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // Check if the login form is displayed by checking for the existence of the login button
    const loginButton = await page.locator('#login-button')
    await expect(loginButton).toBeVisible()
  })
})
