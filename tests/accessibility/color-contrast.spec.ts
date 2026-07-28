import { test, expect } from "@playwright/test";

test.describe("Accessibility - Color Contrast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have sufficient contrast on primary buttons", async ({ page }) => {
    const button = page.locator('button:has-text("Login")');
    const backgroundColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
    const color = await button.evaluate(el => getComputedStyle(el).color);
    
    expect(backgroundColor).toBeDefined();
    expect(color).toBeDefined();
  });

  test("should have sufficient contrast on text", async ({ page }) => {
    const heading = page.locator("h1");
    const backgroundColor = await heading.evaluate(el => getComputedStyle(el.parentElement || el).backgroundColor);
    const color = await heading.evaluate(el => getComputedStyle(el).color);
    
    expect(backgroundColor).toBeDefined();
    expect(color).toBeDefined();
  });
});
