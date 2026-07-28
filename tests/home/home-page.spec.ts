import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display home page", async ({ page }) => {
    await expect(page.locator("h1")).toBeVisible();
  });
});
