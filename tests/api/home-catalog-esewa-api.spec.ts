import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken } from "../utils/api-client";
import { buildClotheApiPayload } from "../test-data/clothes";

/** Direct API coverage for the public /api/v1/home/clothes catalog and the /api/v1/esewa/* payment endpoints. */
test.describe("Home Clothes catalog API (public)", () => {
  test("GET /home/clothes returns a paginated catalog with no auth required", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes?page=1&limit=3`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(Array.isArray(body.responseData.data)).toBe(true);
    expect(body.responseData.data.length).toBeLessThanOrEqual(3);
    expect(body.responseData.meta).toMatchObject({ page: 1, limit: 3 });
  });

  test("GET /home/clothes only returns active items", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=50`);
    const body = await response.json();
    expect(body.responseData.data.every((item: { status: string }) => item.status === "active")).toBe(true);
  });

  test("GET /home/clothes supports a search query parameter", async ({ request }) => {
    const catalogResponse = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=1`);
    const [sample] = (await catalogResponse.json()).responseData.data;
    const searchTerm = String(sample.name).split(" ")[0];

    const response = await request.get(
      `${API_BASE_URL}/api/v1/home/clothes?search=${encodeURIComponent(searchTerm)}`
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.data.length).toBeGreaterThan(0);
  });

  test("GET /home/clothes/:id returns a single active item", async ({ request }) => {
    const catalogResponse = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=1`);
    const [sample] = (await catalogResponse.json()).responseData.data;

    const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes/${sample._id}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData._id).toBe(sample._id);
  });

  test("GET /home/clothes/:id returns 404 for a well-formed but nonexistent id", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes/64b000000000000000000000`);
    expect(response.status()).toBe(404);
  });

  test("GET /home/clothes/:id returns 404 for an inactive (unpublished) item", async ({ request }) => {
    const adminToken = await getAdminToken();
    const created = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(adminToken),
      data: buildClotheApiPayload({ status: "inactive" }),
    });
    const createdId = (await created.json()).responseData._id;

    const response = await request.get(`${API_BASE_URL}/api/v1/home/clothes/${createdId}`);
    expect(response.status()).toBe(404);

    await request.delete(`${API_BASE_URL}/api/v1/admin/clothes/${createdId}`, {
      headers: authHeader(adminToken),
    });
  });
});

test.describe("eSewa API", () => {
  test("GET /esewa/checkout rejects a request missing the required query params", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/esewa/checkout`);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/invalid or expired payment checkout link/i);
  });

  test("GET /esewa/checkout rejects a forged/invalid token", async ({ request }) => {
    const response = await request.get(
      `${API_BASE_URL}/api/v1/esewa/checkout?amount=100&orderId=fake-order&productCode=EPAYTEST&token=forged`
    );
    expect(response.status()).toBe(400);
  });

  test("GET /esewa/payment-url is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/esewa/payment-url?amount=100&orderId=abc`);
    expect(response.status()).toBe(401);
  });

  test("GET /esewa/payment-url rejects a request missing amount/orderId", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.get(`${API_BASE_URL}/api/v1/esewa/payment-url`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/amount and order id are required/i);
  });

  test("GET /esewa/payment-url returns 404 for a nonexistent order", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.get(
      `${API_BASE_URL}/api/v1/esewa/payment-url?amount=100&orderId=64b000000000000000000000`,
      { headers: authHeader(token) }
    );

    expect(response.status()).toBe(404);
  });

  test("POST /esewa/verify is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/esewa/verify`, {
      data: { orderId: "abc" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /esewa/verify rejects a request missing the order id", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/esewa/verify`, {
      headers: authHeader(token),
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/order id is required/i);
  });
});
