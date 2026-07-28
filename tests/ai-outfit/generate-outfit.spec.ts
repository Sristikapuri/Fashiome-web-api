import { test, expect } from "@playwright/test";

test.describe("AI Outfit Generation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to AI outfit generator", async ({ page }) => {
    await page.click('text=AI Stylist');
    await expect(page.locator("h1")).toContainText("AI Outfit Generator");
  });

  test("should generate outfit with prompt", async ({ page }) => {
    await page.click('text=AI Stylist');
    await page.fill('textarea[name="prompt"]', "A casual summer outfit for a beach day");
    await page.click('button:has-text("Generate")');
    
    await expect(page.locator(".loading-spinner")).toBeVisible();
    await expect(page.locator(".generated-outfit")).toBeVisible({ timeout: 30000 });
  });

  test("should select style preference", async ({ page }) => {
    await page.click('text=AI Stylist');
    await page.click('text=Casual');
    await page.fill('textarea[name="prompt"]', "Office outfit");
    await page.click('button:has-text("Generate")');
    
    await expect(page.locator(".generated-outfit")).toBeVisible({ timeout: 30000 });
  });

  test("should generate multiple outfit variations", async ({ page }) => {
    await page.click('text=AI Stylist');
    await page.fill('textarea[name="prompt"]', "Evening dress outfit");
    await page.click('button:has-text("Generate Variations")');
    
    const variations = await page.locator(".outfit-variation").count();
    expect(variations).toBeGreaterThan(1);
  });

  test("should save generated outfit to wardrobe", async ({ page }) => {
    await page.click('text=AI Stylist');
    await page.fill('textarea[name="prompt"]', "Weekend casual");
    await page.click('button:has-text("Generate")');
    
    await page.waitForSelector(".generated-outfit", { timeout: 30000 });
    await page.click('.generated-outfit button:has-text("Save to Wardrobe")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("saved to wardrobe");
  });

  test("should handle empty prompt validation", async ({ page }) => {
    await page.click('text=AI Stylist');
    await page.click('button:has-text("Generate")');
    
    await expect(page.locator(".error-message")).toBeVisible();
    await expect(page.locator(".error-message")).toContainText("prompt is required");
  });
});
