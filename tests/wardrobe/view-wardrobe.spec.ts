import { test, expect } from "@playwright/test";

test.describe("Wardrobe - View Wardrobe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display wardrobe page", async ({ page }) => {
    await page.click('text=My Wardrobe');
    await expect(page.locator("h1")).toContainText("My Wardrobe");
  });

  test("should show all wardrobe items", async ({ page }) => {
    await page.click('text=My Wardrobe');
    const items = await page.locator(".wardrobe-item").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter wardrobe by category", async ({ page }) => {
    await page.click('text=My Wardrobe');
    await page.selectOption("select[name='category']", "tops");
    
    const items = await page.locator(".wardrobe-item[data-category='tops']").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should remove item from wardrobe", async ({ page }) => {
    await page.click('text=My Wardrobe');
    const initialCount = await page.locator(".wardrobe-item").count();
    
    await page.click(".wardrobe-item:first-child .remove-btn");
    const newCount = await page.locator(".wardrobe-item").count();
    
    expect(newCount).toBe(initialCount - 1);
  });

  test("should display empty state when wardrobe is empty", async ({ page }) => {
    await page.click('text=My Wardrobe');
    
    // Remove all items
    while (await page.locator(".wardrobe-item").count() > 0) {
      await page.click(".wardrobe-item:first-child .remove-btn");
    }
    
    await expect(page.locator(".empty-state")).toBeVisible();
    await expect(page.locator(".empty-state")).toContainText("wardrobe is empty");
  });
});
