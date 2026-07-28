import path from "node:path";
import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { UsersListPage } from "../pages/UsersListPage";
import { UserFormPage } from "../pages/UserFormPage";
import { buildClothePayload } from "../test-data/clothes";
import { buildAdminUserPayload } from "../test-data/users";

test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

test.describe("Admin — Delete clothes item", () => {
  async function seedClothe(page: import("@playwright/test").Page) {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);
    const clothe = buildClothePayload();

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");
    await formPage.save(clothe);
    await page.waitForURL("**/dashboard/admin/clothes");

    return { listPage, clothe };
  }

  test("deletes an item after confirming in the dialog", async ({ page }) => {
    const { listPage, clothe } = await seedClothe(page);

    await listPage.search(clothe.name);
    await expect(listPage.rowByName(clothe.name)).toBeVisible();

    await listPage.deleteItem(clothe.name);

    await expect(listPage.rowByName(clothe.name)).toHaveCount(0);
    await expect(listPage.emptyState).toBeVisible();
  });

  test("cancelling the confirmation dialog keeps the item", async ({ page }) => {
    const { listPage, clothe } = await seedClothe(page);

    await listPage.search(clothe.name);
    await listPage.rowByName(clothe.name).getByLabel(`Delete ${clothe.name}`).click();
    await expect(listPage.deleteDialog).toBeVisible();

    await listPage.deleteCancelButton.click();

    await expect(listPage.deleteDialog).toBeHidden();
    await expect(listPage.rowByName(clothe.name)).toBeVisible();
  });
});

test.describe("Admin — Delete user", () => {
  test("deletes a user after confirming in the dialog", async ({ page }) => {
    const listPage = new UsersListPage(page);
    const formPage = new UserFormPage(page);
    const user = buildAdminUserPayload();

    await listPage.goto();
    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");
    await formPage.create(user);
    await page.waitForURL("**/dashboard/admin/users");

    await listPage.search(user.email);
    await expect(listPage.rowByEmail(user.email)).toBeVisible();

    await listPage.deleteUser(user.email);

    await expect(listPage.rowByEmail(user.email)).toHaveCount(0);
  });
});
