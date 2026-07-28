import path from "node:path";
import { test, expect, type Page } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { UsersListPage } from "../pages/UsersListPage";
import { UserFormPage } from "../pages/UserFormPage";
import { buildClothePayload } from "../test-data/clothes";
import { buildAdminUserPayload } from "../test-data/users";
import { uniqueSuffix } from "../utils/random";

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

  test("shows an empty state for a search with no matches", async ({ page }) => {
    const listPage = new ClothesListPage(page);
    await listPage.goto();
    await listPage.search(`no-such-item-${uniqueSuffix()}`);

    await expect(listPage.emptyState).toBeVisible();
  });

  test("filters by category on top of a search", async ({ page }) => {
    const prefix = `Cat-${uniqueSuffix()}`;
    const tops = await createClothe(page, { name: `${prefix} tops item`, category: "tops" });
    await createClothe(page, { name: `${prefix} shoes item`, category: "shoes" });

    const listPage = new ClothesListPage(page);
    await listPage.goto();
    await listPage.search(prefix);
    await expect(listPage.rows).toHaveCount(2);

    await listPage.categoryFilter.selectOption("tops");
    await expect(listPage.rows).toHaveCount(1);
    await expect(listPage.rowByName(tops.name)).toBeVisible();
  });

  test("filters by status on top of a search", async ({ page }) => {
    const prefix = `Status-${uniqueSuffix()}`;
    const active = await createClothe(page, { name: `${prefix} active item`, status: "active" });
    await createClothe(page, { name: `${prefix} inactive item`, status: "inactive" });

    const listPage = new ClothesListPage(page);
    await listPage.goto();
    await listPage.search(prefix);
    await expect(listPage.rows).toHaveCount(2);

    await listPage.statusFilter.selectOption("inactive");
    await expect(listPage.rows).toHaveCount(1);
    await expect(listPage.rowByName(active.name)).toHaveCount(0);
  });

  test("paginates filtered results after changing rows-per-page", async ({ page }) => {
    const prefix = `Page-${uniqueSuffix()}`;
    for (let i = 0; i < 6; i += 1) {
      await createClothe(page, { name: `${prefix} item ${i}` });
    }

    const listPage = new ClothesListPage(page);
    await listPage.goto();
    await listPage.search(prefix);
    await listPage.rowsPerPageSelect.selectOption("5");

    await expect(listPage.pageIndicator).toHaveText("Page 1 of 2");
    await expect(listPage.rows).toHaveCount(5);
    await expect(listPage.prevPageButton).toBeDisabled();

    await listPage.nextPageButton.click();
    await expect(listPage.pageIndicator).toHaveText("Page 2 of 2");
    await expect(listPage.rows).toHaveCount(1);
    await expect(listPage.nextPageButton).toBeDisabled();

    await listPage.prevPageButton.click();
    await expect(listPage.pageIndicator).toHaveText("Page 1 of 2");
  });

  test("opens the view page and shows the item's details", async ({ page }) => {
    const clothe = await createClothe(page);
    const listPage = new ClothesListPage(page);

    await listPage.goto();
    await listPage.search(clothe.name);
    await listPage.viewItem(clothe.name);

    await page.waitForURL(/\/dashboard\/admin\/clothes\/[^/]+$/);
    await expect(page.getByRole("heading", { name: clothe.name })).toBeVisible();
    await expect(page.getByText(clothe.color)).toBeVisible();
    await expect(page.getByText(clothe.size, { exact: false })).toBeVisible();
  });
});

test.describe("Admin — Read / list users", () => {
  test("searches users by email", async ({ page }) => {
    const listPage = new UsersListPage(page);
    const user = buildAdminUserPayload();

    // Seed through the create flow so this spec stays independent of create.spec.ts ordering.
    await listPage.goto();
    await listPage.createUserLink.click();
    await page.waitForURL("**/users/create");
    await new UserFormPage(page).create(user);
    await page.waitForURL("**/dashboard/admin/users");

    await listPage.goto();
    await listPage.search(user.email);
    await expect(listPage.rowByEmail(user.email)).toBeVisible();
  });

  test("shows an empty state for a search with no matches", async ({ page }) => {
    const listPage = new UsersListPage(page);
    await listPage.goto();
    await listPage.search(`no-such-user-${uniqueSuffix()}@fashiome-e2e.test`);

    await expect(listPage.emptyState).toBeVisible();
  });
});
