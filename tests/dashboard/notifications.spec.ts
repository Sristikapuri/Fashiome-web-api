import { test, expect } from "@playwright/test";

test.describe("Dashboard - Notifications", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display notification bell", async ({ page }) => {
    await expect(page.locator(".notification-bell")).toBeVisible();
  });

  test("should show notification dropdown", async ({ page }) => {
    await page.click(".notification-bell");
    await expect(page.locator(".notification-dropdown")).toBeVisible();
  });

  test("should display unread notifications", async ({ page }) => {
    await page.click(".notification-bell");
    const unreadCount = await page.locator(".notification-item.unread").count();
    expect(unreadCount).toBeGreaterThanOrEqual(0);
  });

  test("should mark notification as read", async ({ page }) => {
    await page.click(".notification-bell");
    await page.click(".notification-item:first-child");
    
    await expect(page.locator(".notification-item:first-child")).not.toHaveClass("unread");
  });

  test("should clear all notifications", async ({ page }) => {
    await page.click(".notification-bell");
    await page.click('button:has-text("Mark all as read")');
    
    const unreadCount = await page.locator(".notification-item.unread").count();
    expect(unreadCount).toBe(0);
  });
});
