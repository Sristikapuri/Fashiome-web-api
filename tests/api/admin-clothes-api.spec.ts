import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken } from "../utils/api-client";
import { buildClotheApiPayload } from "../test-data/clothes";

/**
 * Direct API coverage for /api/v1/admin/clothes/*, complementing the
 * page.waitForResponse-driven create/delete flow in api-verification.spec.ts
 * with request-fixture coverage of getById, low-stock, validation, update,
 * patch and role gating.
 */
test.describe("Admin Clothes API", () => {
  let adminToken: string;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  test("GET /admin/clothes is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/clothes`);
    expect(response.status()).toBe(401);
  });

  test("GET /admin/clothes is rejected for a non-admin (member) token", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(token),
    });
    expect(response.status()).toBe(403);
  });

  test("GET /admin/clothes returns a paginated list for an admin token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/clothes?page=1&limit=5`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(Array.isArray(body.responseData.data)).toBe(true);
    expect(body.responseData.meta).toMatchObject({ page: 1, limit: 5 });
  });

  test("GET /admin/clothes/low-stock returns an array for an admin token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/clothes/low-stock`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.responseData)).toBe(true);
  });

  test("GET /admin/clothes/:id returns 404 for a well-formed but nonexistent id", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/clothes/64b000000000000000000000`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/not found/i);
  });

  test("POST /admin/clothes is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      data: buildClotheApiPayload(),
    });
    expect(response.status()).toBe(401);
  });

  test("POST /admin/clothes is rejected for a non-admin (member) token", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(token),
      data: buildClotheApiPayload(),
    });
    expect(response.status()).toBe(403);
  });

  test("POST /admin/clothes rejects a payload missing required fields with 400 + field errors", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(adminToken),
      data: { description: "missing everything else" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toBe("Validation failed");
    expect(body.responseData.errors.length).toBeGreaterThan(0);
  });

  test("POST /admin/clothes creates an item and returns 201 with the created shape", async ({ request }) => {
    const payload = buildClotheApiPayload();

    const response = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(adminToken),
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData).toMatchObject({
      name: payload.name,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
    });
  });

  test.describe("update / patch / delete lifecycle", () => {
    test("PUT, PATCH and DELETE operate on a freshly created item", async ({ request }) => {
      const payload = buildClotheApiPayload();
      const createResponse = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
        headers: authHeader(adminToken),
        data: payload,
      });
      expect(createResponse.status()).toBe(201);
      const created = (await createResponse.json()).responseData;

      const updateResponse = await request.put(`${API_BASE_URL}/api/v1/admin/clothes/${created._id}`, {
        headers: authHeader(adminToken),
        data: { ...payload, price: 55.5, color: "Charcoal" },
      });
      expect(updateResponse.status()).toBe(200);
      const updatedBody = await updateResponse.json();
      expect(updatedBody.responseData.price).toBe(55.5);
      expect(updatedBody.responseData.color).toBe("Charcoal");

      const patchResponse = await request.patch(`${API_BASE_URL}/api/v1/admin/clothes/${created._id}`, {
        headers: authHeader(adminToken),
        data: { stock: 3 },
      });
      expect(patchResponse.status()).toBe(200);
      const patchedBody = await patchResponse.json();
      expect(patchedBody.responseData.stock).toBe(3);

      const deleteResponse = await request.delete(`${API_BASE_URL}/api/v1/admin/clothes/${created._id}`, {
        headers: authHeader(adminToken),
      });
      expect(deleteResponse.status()).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody.isSuccess).toBe(true);

      const getAfterDelete = await request.get(`${API_BASE_URL}/api/v1/admin/clothes/${created._id}`, {
        headers: authHeader(adminToken),
      });
      expect(getAfterDelete.status()).toBe(404);
    });
  });

  test("PUT /admin/clothes/:id returns 404 for a nonexistent id", async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/api/v1/admin/clothes/64b000000000000000000000`, {
      headers: authHeader(adminToken),
      data: buildClotheApiPayload(),
    });
    expect(response.status()).toBe(404);
  });

  test("DELETE /admin/clothes/:id returns 404 for a nonexistent id", async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/admin/clothes/64b000000000000000000000`, {
      headers: authHeader(adminToken),
    });
    expect(response.status()).toBe(404);
  });
});
