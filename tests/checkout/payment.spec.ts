import { test, expect } from "@playwright/test";

test.describe("Checkout - Payment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Cart');
    await page.click('button:has-text("Checkout")');
  });

  test("should display payment options", async ({ page }) => {
    await expect(page.locator('input[value="cod"]')).toBeVisible();
    await expect(page.locator('input[value="esewa"]')).toBeVisible();
  });

  test("should select cash on delivery", async ({ page }) => {
    await page.click('text=Cash on Delivery');
    
    await expect(page.locator('input[value="cod"]')).toBeChecked();
  });

  test("should select eSewa payment", async ({ page }) => {
    await page.click('text=eSewa');
    
    await expect(page.locator('input[value="esewa"]')).toBeChecked();
    await expect(page.locator(".esewa-info")).toBeVisible();
  });

  test("should display order summary", async ({ page }) => {
    await expect(page.locator(".order-summary")).toBeVisible();
    await expect(page.locator(".subtotal")).toBeVisible();
    await expect(page.locator(".tax")).toBeVisible();
    await expect(page.locator(".total")).toBeVisible();
  });
});
