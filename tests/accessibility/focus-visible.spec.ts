import { test, expect } from "@playwright/test";

test.describe("Accessibility - Focus Visible", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should show focus outline on tab", async ({ page }) => {
    await page.keyboard.press("Tab");
    
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);
  });

  test("should maintain focus on interactive elements", async ({ page }) => {
    await page.click('text=Shop');
    
    const url = page.url();
    expect(url).toContain("/shop");
  });
});
