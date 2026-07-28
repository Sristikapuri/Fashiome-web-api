import path from "node:path";
import type { Response } from "@playwright/test";
import { test, expect } from "@playwright/test";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { buildClothePayload } from "../test-data/clothes";
import { API_BASE_URL, authHeader, getAdminToken } from "../utils/api-client";


function isServerActionResponse(res: Response) {
  return (async () => {
    if (res.request().method() !== "POST") return false;
    const nextAction = await res.request().headerValue("next-action");
    return !!nextAction;
  })();
}

test.describe("API verification — admin clothes CRUD", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

  test("create sends a server action POST that persists the item, delete removes it — both confirmed against the backend", async ({
    page,
    request,
  }) => {
    const listPage = new ClothesListPage(page);
    const formPage = new ClotheFormPage(page);
    const clothe = buildClothePayload();
    const adminToken = await getAdminToken();

    await listPage.goto();
    await listPage.newItemLink.click();
    await page.waitForURL("**/clothes/create");

    const [createActionResponse] = await Promise.all([
      page.waitForResponse(isServerActionResponse),
      formPage.save(clothe),
    ]);

    expect(createActionResponse.status()).toBe(200);
    await page.waitForURL("**/dashboard/admin/clothes");

    // UI reflects the new item.
    await listPage.search(clothe.name);
    await expect(listPage.rowByName(clothe.name)).toBeVisible();

    // Independently confirm against the backend that the item was actually
    // persisted (not merely rendered from stale client-side state).
    const listResponse = await request.get(
      `${API_BASE_URL}/api/v1/admin/clothes?search=${encodeURIComponent(clothe.name)}`,
      { headers: authHeader(adminToken) }
    );
    expect(listResponse.status()).toBe(200);
    const listBody = await listResponse.json();
    const created = listBody.responseData.data.find((item: { name: string }) => item.name === clothe.name);
    expect(created).toBeTruthy();
    expect(created.status).toBe(clothe.status);

    const [deleteActionResponse] = await Promise.all([
      page.waitForResponse(isServerActionResponse),
      listPage.deleteItem(clothe.name),
    ]);

    expect(deleteActionResponse.status()).toBe(200);
    await expect(listPage.rowByName(clothe.name)).toHaveCount(0);

    // Independently confirm against the backend that the item was actually removed.
    const afterDeleteResponse = await request.get(`${API_BASE_URL}/api/v1/admin/clothes/${created._id}`, {
      headers: authHeader(adminToken),
    });
    expect(afterDeleteResponse.status()).toBe(404);
  });
});
