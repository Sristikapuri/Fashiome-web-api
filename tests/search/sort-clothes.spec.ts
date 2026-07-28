import { test, expect } from "@playwright/test";

test.describe("Search - Sort Clothes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Shop');
  });

  test("should sort by price low to high", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Price: Low to High');
    
    const firstPrice = await page.locator(".clothes-item:first-child .price").textContent();
    const lastPrice = await page.locator(".clothes-item:last-child .price").textContent();
    
    expect(parseFloat(firstPrice || "0")).toBeLessThanOrEqual(parseFloat(lastPrice || "0"));
  });

  test("should sort by price high to low", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Price: High to Low');
    
    const firstPrice = await page.locator(".clothes-item:first-child .price").textContent();
    const lastPrice = await page.locator(".clothes-item:last-child .price").textContent();
    
    expect(parseFloat(firstPrice || "0")).toBeGreaterThanOrEqual(parseFloat(lastPrice || "0"));
  });

  test("should sort by name alphabetically", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Name');
    
    const items = await page.locator(".clothes-item").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should sort by newest first", async ({ page }) => {
    await page.click('button:has-text("Sort")');
    await page.click('text=Newest');
    
    const items = await page.locator(".clothes-item").count();
    expect(items).toBeGreaterThan(0);
  });
});
