import { test, expect } from "@playwright/test";

test.describe("Error Handling - Validation Error", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.click('text=Login');
    await page.fill('input[name="email"]', "invalid-email");
    await page.click('button:has-text("Login")');
    
    await expect(page.locator(".error-message")).toContainText("Invalid email");
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.click('text=Register');
    await page.fill('input[name="password"]', "123");
    await page.click('button:has-text("Register")');
    
    await expect(page.locator(".error-message")).toContainText("Password must be at least");
  });

  test("should show validation error for required fields", async ({ page }) => {
    await page.click('text=Register');
    await page.click('button:has-text("Register")');
    
    await expect(page.locator(".error-message")).toBeVisible();
  });
});
