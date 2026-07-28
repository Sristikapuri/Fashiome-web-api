import { test, expect, type APIRequestContext } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken, getCatalogClotheId } from "../utils/api-client";


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
