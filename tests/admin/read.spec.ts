import path from "node:path";
import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { buildClothePayload } from "../test-data/clothes";

test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

async function createClothe(page: Page, overrides: Parameters<typeof buildClothePayload>[0] = {}) {
  const listPage = new ClothesListPage(page);
  const formPage = new ClotheFormPage(page);
  const clothe = buildClothePayload(overrides);

  await listPage.goto();
  await listPage.newItemLink.click();
  await page.waitForURL("**/clothes/create");
  await formPage.save(clothe);
  await page.waitForURL("**/dashboard/admin/clothes");

  return clothe;
}

test.describe("Admin — Read / list clothes", () => {
  test("searches the catalog by name", async ({ page }) => {
    const clothe = await createClothe(page);
    const listPage = new ClothesListPage(page);

    await listPage.goto();
    await listPage.search(clothe.name);

    await expect(listPage.rowByName(clothe.name)).toBeVisible();
    await expect(listPage.rows).toHaveCount(1);
  });
});
