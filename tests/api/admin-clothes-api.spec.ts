import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, getAdminToken } from "../utils/api-client";
import { buildClotheApiPayload } from "../test-data/clothes";



test.describe("Admin Clothes API", () => {
  let adminToken: string;
  let createdId: string | undefined;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  // This test creates a real catalog item via the real API — clean it up so
  // the shop catalog doesn't accumulate imageless test items across runs.
  test.afterEach(async ({ request }) => {
    if (!createdId) return;
    await request.delete(`${API_BASE_URL}/api/v1/admin/clothes/${createdId}`, {
      headers: authHeader(adminToken),
    });
    createdId = undefined;
  });

  test("POST /admin/clothes creates an item and returns 201 with the created shape", async ({ request }) => {
    const payload = buildClotheApiPayload();

    const response = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(adminToken),
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    createdId = body.responseData._id;
    expect(body.isSuccess).toBe(true);
    expect(body.responseData).toMatchObject({
      name: payload.name,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
    });
  });
});
