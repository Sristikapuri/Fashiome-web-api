import { test, expect, type APIRequestContext } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken, getCatalogClotheId } from "../utils/api-client";

/** Registers a member, fills their cart, and places one order. Returns the order id + member token. */
async function placeOrderAsNewMember(request: APIRequestContext) {
  const { token } = await createAuthedMember();
  const clotheId = await getCatalogClotheId(request);

  await request.put(`${API_BASE_URL}/api/v1/cart`, {
    headers: authHeader(token),
    data: { items: [{ clotheId, quantity: 1 }] },
  });

  const orderResponse = await request.post(`${API_BASE_URL}/api/v1/orders`, {
    headers: authHeader(token),
    data: { shippingAddress: "123 Playwright Ave, Test City" },
  });
  const orderBody = await orderResponse.json();
  return { token, orderId: orderBody.responseData.order._id as string };
}

/** Direct API coverage for /api/v1/admin/orders/* (list, stats, status transitions, role gating). */
test.describe("Admin Orders API", () => {
  let adminToken: string;

  test.beforeAll(async () => {
    adminToken = await getAdminToken();
  });

  test("GET /admin/orders is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/orders`);
    expect(response.status()).toBe(401);
  });

  test("GET /admin/orders is rejected for a non-admin (member) token", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/orders`, {
      headers: authHeader(token),
    });
    expect(response.status()).toBe(403);
  });

  test("GET /admin/orders returns a paginated list for an admin token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/orders?page=1&limit=10`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(Array.isArray(body.responseData.data)).toBe(true);
    expect(body.responseData.meta).toMatchObject({ page: 1, limit: 10 });
  });

  test("GET /admin/orders/stats returns aggregate stats for an admin token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/admin/orders/stats`, {
      headers: authHeader(adminToken),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData).toBeTruthy();
  });

  test("PATCH /admin/orders/:id/status is rejected without a bearer token", async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/admin/orders/64b000000000000000000000/status`, {
      data: { status: "paid" },
    });
    expect(response.status()).toBe(401);
  });

  test("PATCH /admin/orders/:id/status rejects an invalid status value", async ({ request }) => {
    const { orderId } = await placeOrderAsNewMember(request);

    const response = await request.patch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, {
      headers: authHeader(adminToken),
      data: { status: "not-a-real-status" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/status must be one of/i);
  });

  test("PATCH /admin/orders/:id/status returns 404 for a nonexistent order", async ({ request }) => {
    const response = await request.patch(`${API_BASE_URL}/api/v1/admin/orders/64b000000000000000000000/status`, {
      headers: authHeader(adminToken),
      data: { status: "paid" },
    });
    expect(response.status()).toBe(404);
  });

  test("PATCH /admin/orders/:id/status transitions a real order to 'shipped'", async ({ request }) => {
    const { orderId } = await placeOrderAsNewMember(request);

    const response = await request.patch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, {
      headers: authHeader(adminToken),
      data: { status: "shipped" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.status).toBe("shipped");
  });
});
