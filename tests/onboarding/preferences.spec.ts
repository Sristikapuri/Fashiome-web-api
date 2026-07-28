import { test, expect } from "@playwright/test";

test.describe("Onboarding - Preferences", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display style preferences form", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Next');
    await expect(page.locator("h1")).toContainText("Style Preferences");
  });

  test("should select style preferences", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Next');
    await page.click('text=Casual');
    await page.click('text=Formal');
    
    await expect(page.locator('input[value="casual"]')).toBeChecked();
    await expect(page.locator('input[value="formal"]')).toBeChecked();
  });

  test("should select favorite colors", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Next');
    await page.click('.color-option[data-color="blue"]');
    await page.click('.color-option[data-color="black"]');
    
    await expect(page.locator('.color-option[data-color="blue"].selected')).toBeVisible();
  });

  test("should select size preference", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Next');
    await page.click('text=Medium');
    
    await expect(page.locator('input[value="M"]')).toBeChecked();
  });

  test("should complete onboarding", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Next');
    await page.click('text=Casual');
    await page.click('button:has-text("Complete")');
    
    await expect(page.locator(".success-message")).toBeVisible();
  });
});
