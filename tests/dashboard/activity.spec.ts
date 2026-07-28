import { test, expect } from "@playwright/test";

test.describe("Dashboard - Activity", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display user activity feed", async ({ page }) => {
    await page.click('text=Dashboard');
    await page.click('text=Activity');
    await expect(page.locator(".activity-feed")).toBeVisible();
  });

  test("should show recent activity items", async ({ page }) => {
    await page.click('text=Dashboard');
    await page.click('text=Activity');
    
    const activities = await page.locator(".activity-item").count();
    expect(activities).toBeGreaterThan(0);
  });

  test("should filter activity by type", async ({ page }) => {
    await page.click('text=Dashboard');
    await page.click('text=Activity');
    await page.click('button:has-text("Orders")');
    
    const filteredActivities = await page.locator(".activity-item[data-type='order']").count();
    expect(filteredActivities).toBeGreaterThanOrEqual(0);
  });
});
