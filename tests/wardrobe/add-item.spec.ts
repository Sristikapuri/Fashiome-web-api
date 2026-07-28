import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";

test.describe("Wardrobe - Add Item", () => {
  let clothesListPage: ClothesListPage;

  test.beforeEach(async ({ page }) => {
    clothesListPage = new ClothesListPage(page);
    await page.goto("/");
  });

  test("should add item to wardrobe from clothes list", async ({ page }) => {
    await clothesListPage.navigateToClothes();
    await clothesListPage.clickAddToWardrobe(0);
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("added to wardrobe");
  });

  test("should show wardrobe count increment", async ({ page }) => {
    await clothesListPage.navigateToClothes();
    const initialCount = await clothesListPage.getWardrobeCount();
    
    await clothesListPage.clickAddToWardrobe(0);
    const newCount = await clothesListPage.getWardrobeCount();
    
    expect(newCount).toBe(initialCount + 1);
  });

  test("should handle adding duplicate item", async ({ page }) => {
    await clothesListPage.navigateToClothes();
    await clothesListPage.clickAddToWardrobe(0);
    await clothesListPage.clickAddToWardrobe(0);
    
    const notification = await page.locator(".notification").textContent();
    expect(notification).toContain("already in wardrobe");
  });
});
