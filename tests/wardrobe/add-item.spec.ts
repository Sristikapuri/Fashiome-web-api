import path from "node:path";
import { test, expect } from "@playwright/test";

test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });


test.describe("Wardrobe - Add Item", () => {
  test("should add an item to the wardrobe via photo upload", async ({ page }) => {
    await page.goto("/dashboard?tab=wardrobe");

    await page
      .locator('input[type="file"]')
      .setInputFiles(path.resolve(__dirname, "../../public/images/welcome/hero-gown.jpg"));

    const modal = page.locator(".fixed.inset-0.z-50");
    await expect(modal.getByRole("heading", { name: "Add to Wardrobe" })).toBeVisible();

    const itemName = `E2E Jacket ${Date.now()}`;
    await modal.getByPlaceholder("e.g. Blue Denim Jacket").fill(itemName);
    await modal.getByRole("button", { name: "Tops", exact: true }).click();
    await modal.getByRole("button", { name: /save to wardrobe/i }).click();

    await expect(page.getByText(/added to your wardrobe/i)).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: itemName, exact: true })).toBeVisible();
  });
});
