import { test, expect } from "@playwright/test";

test.describe("Reviews - Helpful Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should mark review as helpful", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('.review-item:first-child .helpful-btn');
    
    await expect(page.locator('.review-item:first-child .helpful-btn.active')).toBeVisible();
  });

  test("should show helpful count", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    
    const helpfulCount = await page.locator('.review-item:first-child .helpful-count').textContent();
    expect(helpfulCount).toBeDefined();
  });

  test("should unmark review as helpful", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('.review-item:first-child .helpful-btn');
    await page.click('.review-item:first-child .helpful-btn');
    
    await expect(page.locator('.review-item:first-child .helpful-btn.active')).not.toBeVisible();
  });
});
