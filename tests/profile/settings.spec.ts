import { test, expect } from "@playwright/test";

test.describe("Profile - Settings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Profile');
    await page.click('text=Settings');
  });

  test("should display settings page", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Settings");
  });

  test("should toggle email notifications", async ({ page }) => {
    const toggle = page.locator('input[name="emailNotifications"]');
    await toggle.click();
    
    await expect(toggle).toBeChecked();
  });

  test("should change language preference", async ({ page }) => {
    await page.selectOption('select[name="language"]', "es");
    await page.click('button:has-text("Save")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("settings saved");
  });

  test("should change theme preference", async ({ page }) => {
    await page.click('button:has-text("Dark Mode")');
    
    await expect(page.locator("body")).toHaveClass(/dark/);
  });

  test("should delete account", async ({ page }) => {
    await page.click('button:has-text("Delete Account")');
    await page.click('button:has-text("Confirm")');
    
    await expect(page).toHaveURL(/login/);
  });
});
