import { test, expect } from "@playwright/test";

test.describe("Search - Search Clothes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should search for clothes by name", async ({ page }) => {
    await page.fill('input[name="search"]', "shirt");
    await page.press('input[name="search"]', "Enter");
    
    const results = await page.locator(".clothes-item").count();
    expect(results).toBeGreaterThan(0);
  });

  test("should display search results", async ({ page }) => {
    await page.fill('input[name="search"]', "dress");
    await page.press('input[name="search"]', "Enter");
    
    await expect(page.locator(".search-results")).toBeVisible();
  });

  test("should show no results for empty search", async ({ page }) => {
    await page.fill('input[name="search"]', "nonexistentitem123");
    await page.press('input[name="search"]', "Enter");
    
    await expect(page.locator(".no-results")).toBeVisible();
  });

  test("should clear search results", async ({ page }) => {
    await page.fill('input[name="search"]', "shirt");
    await page.press('input[name="search"]', "Enter");
    await page.click('button:has-text("Clear")');
    
    await expect(page.locator('input[name="search"]')).toHaveValue("");
  });
});
