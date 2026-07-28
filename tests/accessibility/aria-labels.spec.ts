import { test, expect } from "@playwright/test";

test.describe("Accessibility - ARIA Labels", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have aria-label on navigation menu", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toHaveAttribute("role", "navigation");
  });

  test("should have aria-label on buttons", async ({ page }) => {
    const buttons = page.locator("button:not([aria-label])");
    const count = await buttons.count();
    
    const buttonsWithText = await page.locator("button").count();
    expect(count).toBe(buttonsWithText);
  });

  test("should have aria-label on form inputs", async ({ page }) => {
    await page.click('text=Login');
    
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute("aria-label");
  });
});
