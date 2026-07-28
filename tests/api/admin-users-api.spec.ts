import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken } from "../utils/api-client";
import { buildAdminUserPayload } from "../test-data/users";

/** Direct API coverage for /api/v1/admin/users/* (create/read/update/delete + role gating). */
test.describe("Admin Users API", () => {
  let adminToken: string;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  test("GET /admin/users is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/users`);
    expect(response.status()).toBe(401);
  });

  test("GET /admin/users is rejected for a non-admin (member) token", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(token),
    });
    expect(response.status()).toBe(403);
  });

  test("GET /admin/users returns a paginated list for an admin token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/users?page=1&limit=5`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(Array.isArray(body.responseData.data)).toBe(true);
    expect(body.responseData.meta).toMatchObject({ page: 1, limit: 5 });
    expect(body.responseData.data.every((u: { password?: string }) => u.password === undefined)).toBe(true);
  });

  test("GET /admin/users/:id returns 404 for a well-formed but nonexistent id", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/users/64b000000000000000000000`, {
      headers: authHeader(adminToken),
    });
    expect(response.status()).toBe(404);
  });

  test("POST /admin/users is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      data: buildAdminUserPayload(),
    });
    expect(response.status()).toBe(401);
  });

  test("POST /admin/users rejects a username shorter than 3 characters with 400 + field errors", async ({ request }) => {
    const payload = buildAdminUserPayload({ username: "ab" });
    const response = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(adminToken),
      data: { ...payload, age: Number(payload.age) },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseData.errors.some((e: { field: string }) => e.field === "username")).toBe(true);
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

  test("POST /admin/users rejects a duplicate email with a 400", async ({ request }) => {
    const payload = buildAdminUserPayload();
    const first = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(adminToken),
      data: { ...payload, age: Number(payload.age) },
    });
    expect(first.status()).toBe(201);

    const duplicate = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(adminToken),
      data: { ...buildAdminUserPayload({ email: payload.email }), age: Number(payload.age) },
    });

    expect(duplicate.status()).toBe(400);
    const body = await duplicate.json();
    expect(body.responseMessage).toMatch(/already registered/i);
  });

  test("update/delete lifecycle: PUT, PATCH and DELETE operate on a freshly created user", async ({ request }) => {
    const payload = buildAdminUserPayload();
    const createResponse = await request.post(`${API_BASE_URL}/api/v1/admin/users`, {
      headers: authHeader(adminToken),
      data: { ...payload, age: Number(payload.age) },
    });
    expect(createResponse.status()).toBe(201);
    const created = (await createResponse.json()).responseData;

    const putResponse = await request.put(`${API_BASE_URL}/api/v1/admin/users/${created._id}`, {
      headers: authHeader(adminToken),
      data: { firstName: "Renamed" },
    });
    expect(putResponse.status()).toBe(200);
    expect((await putResponse.json()).responseData.firstName).toBe("Renamed");

    const patchResponse = await request.patch(`${API_BASE_URL}/api/v1/admin/users/${created._id}`, {
      headers: authHeader(adminToken),
      data: { status: "inactive" },
    });
    expect(patchResponse.status()).toBe(200);
    expect((await patchResponse.json()).responseData.status).toBe("inactive");

    const deleteResponse = await request.delete(`${API_BASE_URL}/api/v1/admin/users/${created._id}`, {
      headers: authHeader(adminToken),
    });
    expect(deleteResponse.status()).toBe(200);

    const getAfterDelete = await request.get(`${API_BASE_URL}/api/v1/admin/users/${created._id}`, {
      headers: authHeader(adminToken),
    });
    expect(getAfterDelete.status()).toBe(404);
  });

  test("DELETE /admin/users/:id returns 404 for a nonexistent id", async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/admin/users/64b000000000000000000000`, {
      headers: authHeader(adminToken),
    });
    expect(response.status()).toBe(404);
  });
});
