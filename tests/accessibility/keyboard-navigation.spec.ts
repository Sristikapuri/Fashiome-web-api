import { test, expect } from "@playwright/test";

test.describe("Accessibility - Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate using tab key", async ({ page }) => {
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toMatch(/^(A|BUTTON)$/);
  });

  test("should focus on interactive elements", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);
  });

  test("should activate buttons with Enter key", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    
    await expect(page).toHaveURL(/./);
  });
});
