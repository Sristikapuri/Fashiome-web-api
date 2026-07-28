import { test, expect } from "@playwright/test";

test.describe("Error Handling - Network Error", () => {
  test("should display error message on API failure", async ({ page }) => {
    await page.goto("/");
    
    // Simulate network error by intercepting request
    await page.route("**/api/clothes", route => route.abort());
    
    await page.click('text=Shop');
    
    await expect(page.locator(".error-message")).toBeVisible();
    await expect(page.locator(".error-message")).toContainText("network error");
  });

  test("should provide retry option on network error", async ({ page }) => {
    await page.route("**/api/clothes", route => route.abort());
    
    await page.click('text=Shop');
    await page.click('button:has-text("Retry")');
    
    // Would retry the failed request
    await expect(page.locator(".error-message")).toBeVisible();
  });
});
