import path from "node:path";
import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { UsersListPage } from "../pages/UsersListPage";
import { UserFormPage } from "../pages/UserFormPage";
import { buildClothePayload } from "../test-data/clothes";
import { buildAdminUserPayload } from "../test-data/users";

test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

test.describe("Admin — Create clothes item", () => {
  test("creates a new clothes item and shows it in the catalog", async ({ page }) => {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);
    const clothe = buildClothePayload();

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");

    await formPage.save(clothe);

    await page.waitForURL("**/dashboard/admin/clothes");
    await listPage.search(clothe.name);
    await expect(listPage.rowByName(clothe.name)).toBeVisible();
    await expect(listPage.rowByName(clothe.name)).toContainText(clothe.category);
    await expect(listPage.rowByName(clothe.name)).toContainText("$" + Number(clothe.price).toFixed(2));
  });
});

test.describe("Admin — Create user", () => {
  test("creates a new user and shows it in the user list", async ({ page }) => {
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
  });
});
