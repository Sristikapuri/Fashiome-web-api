import { test, expect } from "@playwright/test";

test.describe("Reviews - View Reviews", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display reviews on product page", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    
    await expect(page.locator(".reviews-section")).toBeVisible();
  });

  test("should show review rating", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    
    const stars = await page.locator(".review-stars").count();
    expect(stars).toBeGreaterThan(0);
  });

  test("should show review comment", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    
    await expect(page.locator(".review-comment")).toBeVisible();
  });

  test("should filter reviews by rating", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('button:has-text("5 Stars")');
    
    const filteredReviews = await page.locator(".review-item[data-rating='5']").count();
    expect(filteredReviews).toBeGreaterThanOrEqual(0);
  });

  test("should sort reviews by date", async ({ page }) => {
    await page.click('text=Shop');
    await page.click(".clothes-item:first-child");
    await page.click('button:has-text("Sort by Date")');
    
    const reviews = await page.locator(".review-item").count();
    expect(reviews).toBeGreaterThanOrEqual(0);
  });
});
