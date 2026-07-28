import { test, expect } from "@playwright/test";

test.describe("Reviews - Add Review", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display review form on product page", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('text=Write Review');
    
    await expect(page.locator(".review-form")).toBeVisible();
  });

  test("should select star rating", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('text=Write Review');
    await page.click('.star-rating[data-rating="5"]');
    
    await expect(page.locator('.star-rating[data-rating="5"].active')).toBeVisible();
  });

  test("should submit review with comment", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('text=Write Review');
    await page.click('.star-rating[data-rating="4"]');
    await page.fill('textarea[name="comment"]', "Great product!");
    await page.click('button:has-text("Submit")');
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("review submitted");
  });

  test("should validate rating is required", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('text=Write Review');
    await page.fill('textarea[name="comment"]', "Test comment");
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator(".error-message")).toContainText("rating is required");
  });
});
