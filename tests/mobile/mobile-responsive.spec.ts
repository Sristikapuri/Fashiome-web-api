import { test, expect } from "@playwright/test";

test.describe("Mobile Responsive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display correctly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should show mobile menu on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click(".mobile-menu-toggle");
    await expect(page.locator(".mobile-menu")).toBeVisible();
  });

  test("should handle touch interactions", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.tap(".mobile-menu-toggle");
    await expect(page.locator(".mobile-menu")).toBeVisible();
  });

  test("should display responsive product grid", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('text=Shop');
    await expect(page.locator(".clothes-grid")).toBeVisible();
  });

  test("should handle landscape orientation", async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator("h1")).toBeVisible();
  });
});
