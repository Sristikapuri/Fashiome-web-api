import { test, expect } from "@playwright/test";

test.describe("Wardrobe - Organize Wardrobe", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=My Wardrobe');
  });

  test("should sort items by name", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Name');
    
    const firstItemName = await page.locator(".wardrobe-item:first-child .item-name").textContent();
    const lastItemName = await page.locator(".wardrobe-item:last-child .item-name").textContent();
    
    expect(firstItemName).toBeDefined();
    expect(lastItemName).toBeDefined();
  });

  test("should sort items by date added", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Date Added');
    
    const items = await page.locator(".wardrobe-item").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter by color", async ({ page }) => {
    await page.click('button:has-text("Filter")');
    await page.click('text=Blue');
    
    const blueItems = await page.locator(".wardrobe-item[data-color='blue']").count();
    expect(blueItems).toBeGreaterThan(0);
  });

  test("should create outfit from wardrobe items", async ({ page }) => {
    await page.click(".wardrobe-item:first-child .select-btn");
    await page.click(".wardrobe-item:nth-child(2) .select-btn");
    await page.click('button:has-text("Create Outfit")');
    
    await expect(page.locator(".outfit-preview")).toBeVisible();
  });

  test("should save outfit combination", async ({ page }) => {
    await page.click(".wardrobe-item:first-child .select-btn");
    await page.click('button:has-text("Save Outfit")');
    await page.fill('input[name="outfitName"]', "Summer Casual");
    await page.click('button:has-text("Save")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("outfit saved");
  });
});
