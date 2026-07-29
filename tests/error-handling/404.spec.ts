import { test, expect } from "../fixtures";


test.describe("Error Handling - 404 Page", () => {
  test("should display Next.js's default 404 page for a non-existent route", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-e2e");

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "404" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "This page could not be found." })).toBeVisible();
  });
});
