import { test, expect } from "@playwright/test";

test.describe("Onboarding - Silhouette", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display silhouette measurement form", async ({ page }) => {
    await page.click('text=Complete Profile');
    await expect(page.locator("h1")).toContainText("Body Measurements");
  });

  test("should select body type", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Hourglass');
    
    await expect(page.locator('input[value="hourglass"]')).toBeChecked();
  });

  test("should enter height and weight", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.fill('input[name="height"]', "170");
    await page.fill('input[name="weight"]', "65");
    
    await expect(page.locator('input[name="height"]')).toHaveValue("170");
  });

  test("should save silhouette data", async ({ page }) => {
    await page.click('text=Complete Profile');
    await page.click('text=Hourglass');
    await page.fill('input[name="height"]', "170");
    await page.fill('input[name="weight"]', "65");
    await page.click('button:has-text("Save")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("saved");
  });
});
