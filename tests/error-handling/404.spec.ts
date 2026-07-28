import { test, expect } from "@playwright/test";

test.describe("Error Handling - 404 Page", () => {
  test("should display 404 page for non-existent route", async ({ page }) => {
    await page.goto("/non-existent-page");
    
    await expect(page.locator("h1")).toContainText("404");
    await expect(page.locator("p")).toContainText("Page not found");
  });

  test("should return to home from 404 page", async ({ page }) => {
    await page.goto("/non-existent-page");
    await page.click('button:has-text("Go Home")');
    
    await expect(page).toHaveURL("/");
  });
});
