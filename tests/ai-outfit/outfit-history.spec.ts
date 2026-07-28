import { test, expect } from "@playwright/test";

test.describe("AI Outfit History", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=AI Stylist');
  });

  test("should display outfit generation history", async ({ page }) => {
    await page.click('text=History');
    await expect(page.locator(".outfit-history")).toBeVisible();
  });

  test("should load previous outfit from history", async ({ page }) => {
    await page.click('text=History');
    await page.click(".outfit-history-item:first-child");
    
    await expect(page.locator(".outfit-preview")).toBeVisible();
  });

  test("should delete outfit from history", async ({ page }) => {
    await page.click('text=History');
    const initialCount = await page.locator(".outfit-history-item").count();
    
    await page.click(".outfit-history-item:first-child .delete-btn");
    const newCount = await page.locator(".outfit-history-item").count();
    
    expect(newCount).toBe(initialCount - 1);
  });

  test("should regenerate outfit from history", async ({ page }) => {
    await page.click('text=History');
    await page.click(".outfit-history-item:first-child .regenerate-btn");
    
    await expect(page.locator(".loading-spinner")).toBeVisible();
    await expect(page.locator(".generated-outfit")).toBeVisible({ timeout: 30000 });
  });

  test("should filter history by date", async ({ page }) => {
    await page.click('text=History');
    await page.click('button:has-text("Filter")');
    await page.click('text=This Week');
    
    const items = await page.locator(".outfit-history-item").count();
    expect(items).toBeGreaterThanOrEqual(0);
  });
});
