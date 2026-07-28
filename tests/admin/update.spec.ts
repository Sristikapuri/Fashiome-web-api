import path from "node:path";
import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { buildClothePayload } from "../test-data/clothes";

test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

test.describe("Admin — Update clothes item", () => {
  test("edits an item's price, stock, and status and shows the change in the table", async ({ page }) => {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);
    const original = buildClothePayload();

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");
    await formPage.save(original);
    await page.waitForURL("**/dashboard/admin/clothes");

    await listPage.search(original.name);
    await listPage.editItem(original.name);
    await page.waitForURL(/\/clothes\/[^/]+\/edit$/);

    await formPage.save({ price: "150.00", stock: "3", status: "inactive" });
    await page.waitForURL("**/dashboard/admin/clothes");

    await listPage.search(original.name);
    const row = listPage.rowByName(original.name);
    await expect(row).toContainText("$150.00");
    await expect(row).toContainText("3");
    await expect(row).toContainText("inactive");
  });
});
