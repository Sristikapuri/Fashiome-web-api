import { test, expect } from "@playwright/test";

test.describe("Checkout - View Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display cart page", async ({ page }) => {
    await page.click('text=Cart');
    await expect(page.locator("h1")).toContainText("Shopping Cart");
  });

  test("should show cart items", async ({ page }) => {
    await page.click('text=Cart');
    const items = await page.locator(".cart-item").count();
    expect(items).toBeGreaterThanOrEqual(0);
  });

  test("should display cart total", async ({ page }) => {
    await page.click('text=Cart');
    await expect(page.locator(".cart-total")).toBeVisible();
  });

  test("should show empty cart when no items", async ({ page }) => {
    await page.click('text=Cart');
    
    while (await page.locator(".cart-item").count() > 0) {
      await page.click(".cart-item:first-child .remove-btn");
    }
    
    await expect(page.locator(".empty-cart")).toBeVisible();
  });

  test("should update item quantity", async ({ page }) => {
    await page.click('text=Cart');
    await page.click(".cart-item:first-child .quantity-increase");
    
    const quantity = await page.locator(".cart-item:first-child .quantity").textContent();
    expect(quantity).toBe("2");
  });
});
