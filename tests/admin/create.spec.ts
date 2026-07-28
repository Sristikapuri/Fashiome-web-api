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

  test("shows required-field validation and does not submit", async ({ page }) => {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");

    await formPage.submit();

    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/size is required/i)).toBeVisible();
    await expect(page.getByText(/color is required/i)).toBeVisible();
    await expect(page).toHaveURL(/\/clothes\/create$/);
  });

  test("rejects a negative price and negative stock", async ({ page }) => {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);
    const clothe = buildClothePayload({ price: "-5", stock: "-1" });

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");

    await formPage.save(clothe);

    await expect(page.getByText(/price must be zero or more/i)).toBeVisible();
    await expect(page.getByText(/stock must be zero or more/i)).toBeVisible();
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

  test("rejects a password shorter than 6 characters", async ({ page }) => {
    const listPage = new UsersListPage(page);
    const formPage = new UserFormPage(page);
    const user = buildAdminUserPayload({ password: "123" });

    await listPage.goto();
    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");

    await formPage.create(user);

    await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible();
    await expect(page).toHaveURL(/\/users\/create$/);
  });

  test("surfaces a backend error when the email is already registered", async ({ page }) => {
    const listPage = new UsersListPage(page);
    const formPage = new UserFormPage(page);
    const user = buildAdminUserPayload();

    await listPage.goto();
    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");
    await formPage.create(user);
    await page.waitForURL("**/dashboard/admin/users");

    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");
    await formPage.create(buildAdminUserPayload({ email: user.email }));

    await expect(page.getByText(/failed to create user|already (exists|registered|in use)/i)).toBeVisible();
    await expect(page).toHaveURL(/\/users\/create$/);
  });
});
