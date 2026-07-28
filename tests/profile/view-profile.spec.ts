import { test, expect } from "@playwright/test";

test.describe("Profile - View Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Profile');
  });

  test("should display user profile information", async ({ page }) => {
    await expect(page.locator(".profile-name")).toBeVisible();
    await expect(page.locator(".profile-email")).toBeVisible();
  });

  test("should show user statistics", async ({ page }) => {
    await expect(page.locator(".wardrobe-count")).toBeVisible();
    await expect(page.locator(".outfits-created")).toBeVisible();
  });

  test("should display profile picture", async ({ page }) => {
    await expect(page.locator(".profile-avatar")).toBeVisible();
  });

  test("should navigate to edit profile", async ({ page }) => {
    await page.click('button:has-text("Edit Profile")');
    await expect(page.locator("h1")).toContainText("Edit Profile");
  });
});
