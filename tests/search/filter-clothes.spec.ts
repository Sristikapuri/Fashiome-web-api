import path from "node:path";
import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, getAdminToken } from "../utils/api-client";
import { buildClotheApiPayload } from "../test-data/clothes";


test.describe("Search - Filter Clothes", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });

  let itemName: string;
  let adminToken: string;
  let createdId: string;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
    itemName = `E2E Filter Tops ${Date.now()}`;
    const payload = buildClotheApiPayload({ name: itemName, category: "tops", gender: "unisex" });

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/clothes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(adminToken) },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to seed a 'tops' catalog item for filter tests: ${response.status}`);
    }
    createdId = (await response.json()).responseData._id;
  });

  // Both tests in this file share the one seeded item — clean it up once
  // both are done so the shop catalog doesn't accumulate imageless test items.
  test.afterAll(async () => {
    await fetch(`${API_BASE_URL}/api/v1/admin/clothes/${createdId}`, {
      method: "DELETE",
      headers: authHeader(adminToken),
    });
  });

  test("should filter the grid down to the selected category", async ({ page }) => {
    await page.goto("/dashboard?tab=shop");
    await page.getByPlaceholder("Search products...").fill(itemName);

    const topsPill = page.getByRole("button", { name: "tops", exact: true });
    await topsPill.click();

    await expect(page.getByText(itemName)).toBeVisible();
    await expect(topsPill).toHaveClass(/bg-\[#820000\]/);
  });

  test("should return to all categories when All is reselected", async ({ page }) => {
    await page.goto("/dashboard?tab=shop");
    await page.getByPlaceholder("Search products...").fill(itemName);

    const topsPill = page.getByRole("button", { name: "tops", exact: true });
    const allPill = page.getByRole("button", { name: "All", exact: true });

    await topsPill.click();
    await expect(topsPill).toHaveClass(/bg-\[#820000\]/);

    await allPill.click();

    await expect(allPill).toHaveClass(/bg-\[#820000\]/);
    await expect(topsPill).not.toHaveClass(/bg-\[#820000\]/);
    await expect(page.getByText(itemName)).toBeVisible();
  });
});
