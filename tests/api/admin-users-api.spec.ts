import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, getAdminToken } from "../utils/api-client";
import { buildAdminUserPayload } from "../test-data/users";


test.describe("Admin Users API", () => {
  let adminToken: string;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  test("POST /admin/users creates a user and returns 201 with a sanitized body", async ({ request }) => {
    const payload = buildAdminUserPayload();
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(adminToken),
      data: { ...payload, age: Number(payload.age) },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.email).toBe(payload.email);
    expect(body.responseData.password).toBeUndefined();
  });
});
