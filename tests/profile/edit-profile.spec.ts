import { test, expect } from "@playwright/test";

test.describe("Profile - Edit Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Profile');
    await page.click('button:has-text("Edit Profile")');
  });

  test("should update profile name", async ({ page }) => {
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="lastName"]', "Doe");
    await page.click('button:has-text("Save Changes")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("profile updated");
  });

  test("should update profile picture", async ({ page }) => {
    await page.click('button:has-text("Change Photo")');
    await page.setInputFiles('input[type="file"]', "test-avatar.jpg");
    await page.click('button:has-text("Upload")');
    
    await expect(page.locator(".profile-avatar")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.fill('input[name="firstName"]', "");
    await page.click('button:has-text("Save Changes")');
    
    await expect(page.locator(".error-message")).toBeVisible();
  });

  test("should cancel profile edit", async ({ page }) => {
    await page.fill('input[name="firstName"]', "Changed");
    await page.click('button:has-text("Cancel")');
    
    await expect(page.locator("h1")).toContainText("Profile");
  });
});
