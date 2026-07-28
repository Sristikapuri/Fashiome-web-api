import path from "node:path";
import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { UsersListPage } from "../pages/UsersListPage";
import { UserFormPage } from "../pages/UserFormPage";
import { buildClothePayload } from "../test-data/clothes";
import { buildAdminUserPayload } from "../test-data/users";

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

  test("keeps the previous values when validation fails on save", async ({ page }) => {
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

    await formPage.save({ price: "-20" });

    await expect(page.getByText(/price must be zero or more/i)).toBeVisible();
    await expect(page).toHaveURL(/\/edit$/);
  });
});

test.describe("Admin — Update user", () => {
  test("edits a user's status from active to inactive", async ({ page }) => {
    const listPage = new UsersListPage(page);
    const formPage = new UserFormPage(page);
    const user = buildAdminUserPayload({ status: "active" });

    await listPage.goto();
    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");
    await formPage.create(user);
    await page.waitForURL("**/dashboard/admin/users");

    await listPage.search(user.email);
    await listPage.editUser(user.email);
    await page.waitForURL(/\/users\/[^/]+\/edit$/);

    await page.locator('select[name="status"]').selectOption("inactive");
    await page.getByRole("button", { name: /save|update/i }).click();
    await page.waitForURL("**/dashboard/admin/users");

    await listPage.search(user.email);
    await expect(listPage.rowByEmail(user.email)).toContainText(/inactive/i);
  });
});
