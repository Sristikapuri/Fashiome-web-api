import { test, expect } from "@playwright/test";

test.describe("Search - Filter Clothes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Shop');
  });

  test("should filter by category", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('text=Tops');
    await page.click('button:has-text("Apply")');
    
    const items = await page.locator(".clothes-item[data-category='tops']").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter by gender", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('text=Female');
    await page.click('button:has-text("Apply")');
    
    const items = await page.locator(".clothes-item[data-gender='female']").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter by price range", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.fill('input[name="minPrice"]', "10");
    await page.fill('input[name="maxPrice"]', "50");
    await page.click('button:has-text("Apply")');
    
    const items = await page.locator(".clothes-item").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter by color", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('.color-filter[data-color="blue"]');
    await page.click('button:has-text("Apply")');
    
    const items = await page.locator(".clothes-item[data-color='blue']").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should filter by size", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('.size-filter[data-size="M"]');
    await page.click('button:has-text("Apply")');
    
    const items = await page.locator(".clothes-item[data-size='M']").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should reset all filters", async ({ page }) => {
    await page.click('button:has-text("Filters")');
    await page.click('text=Tops');
    await page.click('button:has-text("Reset")');
    
    await expect(page.locator('input[name="category"]')).not.toBeChecked();
  });
});
