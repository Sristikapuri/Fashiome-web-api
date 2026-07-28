import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display home page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should show featured products", async ({ page }) => {
    await expect(page.locator(".featured-products")).toBeVisible();
  });

  test("should navigate to shop from home", async ({ page }) => {
    await page.click('text=Shop');
    await expect(page).toHaveURL(/shop/);
  });

  test("should display hero section", async ({ page }) => {
    await expect(page.locator(".hero-section")).toBeVisible();
  });

  test("should show call to action buttons", async ({ page }) => {
    await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
  });
});
