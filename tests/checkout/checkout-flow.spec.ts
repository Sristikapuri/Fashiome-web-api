import { test, expect } from "@playwright/test";

test.describe("Checkout - Checkout Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.click('text=Cart');
  });

  test("should proceed to checkout", async ({ page }) => {
    await page.click('button:has-text("Checkout")');
    await expect(page.locator("h1")).toContainText("Checkout");
  });

  test("should fill shipping information", async ({ page }) => {
    await page.click('button:has-text("Checkout")');
    await page.fill('input[name="fullName"]', "John Doe");
    await page.fill('input[name="address"]', "123 Test Street");
    await page.fill('input[name="city"]', "Kathmandu");
    await page.fill('input[name="phone"]', "9876543210");
    
    await expect(page.locator('input[name="fullName"]')).toHaveValue("John Doe");
  });

  test("should select payment method", async ({ page }) => {
    await page.click('button:has-text("Checkout")');
    await page.click('text=eSewa');
    
    await expect(page.locator('input[value="esewa"]')).toBeChecked();
  });

  test("should place order successfully", async ({ page }) => {
    await page.click('button:has-text("Checkout")');
    await page.fill('input[name="fullName"]', "John Doe");
    await page.fill('input[name="address"]', "123 Test Street");
    await page.fill('input[name="city"]', "Kathmandu");
    await page.fill('input[name="phone"]', "9876543210");
    await page.click('button:has-text("Place Order")');
    
    await expect(page.locator(".order-confirmation")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.click('button:has-text("Checkout")');
    await page.click('button:has-text("Place Order")');
    
    await expect(page.locator(".error-message")).toBeVisible();
  });
});
