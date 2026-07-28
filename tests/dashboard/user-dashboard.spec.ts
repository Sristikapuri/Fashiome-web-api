import { test, expect } from "@playwright/test";

test.describe("Dashboard - User Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display user dashboard", async ({ page }) => {
    await page.click('text=Dashboard');
    await expect(page.locator("h1")).toContainText("My Dashboard");
  });

  test("should show recent orders", async ({ page }) => {
    await page.click('text=Dashboard');
    await expect(page.locator(".recent-orders")).toBeVisible();
  });

  test("should show wardrobe statistics", async ({ page }) => {
    await page.click('text=Dashboard');
    await expect(page.locator(".wardrobe-stats")).toBeVisible();
  });

  test("should show recommended outfits", async ({ page }) => {
    await page.click('text=Dashboard');
    await expect(page.locator(".recommended-outfits")).toBeVisible();
  });

  test("should navigate to order details", async ({ page }) => {
    await page.click('text=Dashboard');
    await page.click(".recent-orders .order-item:first-child");
    
    await expect(page.locator("h1")).toContainText("Order Details");
  });
});
