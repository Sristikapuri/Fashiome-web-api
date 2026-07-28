import path from "node:path";
import type { Response } from "@playwright/test";
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ClothesListPage } from "../pages/ClothesListPage";
import { ClotheFormPage } from "../pages/ClotheFormPage";
import { ADMIN_CREDENTIALS } from "../test-data/users";
import { buildClothePayload } from "../test-data/clothes";
import { ROUTES } from "../test-data/routes";
import { API_BASE_URL, authHeader, getAdminToken } from "../utils/api-client";

/**
 * The login form and the admin clothes create/delete flows submit through
 * Next.js Server Actions ("use server" functions), not a direct browser
 * fetch/axios call to /api/v1/.... The network request the browser actually
 * makes for a Server Action is a POST to the *current page URL* carrying a
 * `next-action` request header, and its response body is an RSC-encoded
 * stream — not the raw backend JSON. So these tests intercept that
 * same-page POST (status only) and assert the resulting UI/DOM state, while
 * independently hitting the backend with the `request` fixture (the same
 * pattern used throughout tests/api/*-api.spec.ts) to keep genuine API-level
 * verification — status codes and response shape — intact.
 */
function isServerActionResponse(res: Response) {
  return (async () => {
    if (res.request().method() !== "POST") return false;
    const nextAction = await res.request().headerValue("next-action");
    return !!nextAction;
  })();
}

test.describe("API verification (network interception)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("login sends the expected server action request and both the UI and backend confirm success", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const [actionResponse] = await Promise.all([
      page.waitForResponse(isServerActionResponse),
      loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password),
    ]);

    // The Server Action's own RSC response — proves the request round-tripped.
    expect(actionResponse.status()).toBe(200);

    // On success the form stores the token and redirects the admin to their dashboard.
    await page.waitForURL(`**${ROUTES.admin}`);
    const token = await page.evaluate(() => localStorage.getItem("token"));
    expect(token).toBeTruthy();

    // Independently confirm against the real backend that these credentials
    // are in fact valid and return a token for this user.
    const apiResponse = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_CREDENTIALS.email, password: ADMIN_CREDENTIALS.password },
    });
    expect(apiResponse.status()).toBe(200);
    const apiBody = await apiResponse.json();
    expect(apiBody.isSuccess).toBe(true);
    expect(apiBody.responseData.token).toBeTruthy();
    expect(apiBody.responseData.user.email).toBe(ADMIN_CREDENTIALS.email);
  });

  test("an invalid login surfaces an error in the UI and the backend independently rejects it with a non-2xx status", async ({
    page,
    request,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const [actionResponse] = await Promise.all([
      page.waitForResponse(isServerActionResponse),
      loginPage.login(ADMIN_CREDENTIALS.email, "wrong-password"),
    ]);

    // The server action itself still completes (200) — the failure lives in
    // its returned payload, not the HTTP status of the RSC response, which
    // is exactly why the UI/backend assertions below matter.
    expect(actionResponse.status()).toBe(200);

    await expect(loginPage.formError).toBeVisible();
    await expect(loginPage.formError).not.toHaveText("");
    expect(page.url()).toContain(ROUTES.login);

    // Independently verify against the real backend that these credentials
    // are rejected with a non-2xx status and an error message.
    const apiResponse = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_CREDENTIALS.email, password: "wrong-password" },
    });
    expect(apiResponse.status()).toBeGreaterThanOrEqual(400);
    const apiBody = await apiResponse.json();
    expect(apiBody.isSuccess).toBe(false);
    expect(apiBody.responseMessage).toBeTruthy();
  });
});

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

  test("the clothes list request is rejected without a bearer token", async ({ page, request }) => {
    const apiBaseUrl = process.env.E2E_API_BASE_URL || "http://localhost:8089";
    const response = await request.get(`${apiBaseUrl}/api/v1/admin/clothes`);

    expect(response.status()).toBe(401);
  });
});
