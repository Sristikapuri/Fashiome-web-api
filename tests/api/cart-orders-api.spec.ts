import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";

/** Direct API coverage for /api/v1/cart and /api/v1/orders/*, chained together since placing an order requires a filled cart. */
test.describe("Cart API", () => {
  test("GET /cart is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/cart`);
    expect(response.status()).toBe(401);
  });

  test("GET /cart returns an empty item list for a freshly registered member", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.get(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.items).toEqual([]);
  });

  test("PUT /cart is rejected without a bearer token", async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/api/v1/cart`, {
      data: { items: [] },
    });
    expect(response.status()).toBe(401);
  });

  test("PUT /cart rejects a non-array items payload", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: "not-an-array" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/invalid cart items/i);
  });

  test("PUT /cart rejects an item missing a clotheId", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: [{ quantity: 1 }] },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/invalid cart item payload/i);
  });

  test("PUT /cart followed by GET /cart reflects the saved items", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const putResponse = await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: [{ clotheId, quantity: 2 }] },
    });
    expect(putResponse.status()).toBe(200);
    const putBody = await putResponse.json();
    expect(putBody.responseData.items).toHaveLength(1);
    expect(putBody.responseData.items[0]).toMatchObject({ clotheId, quantity: 2 });

    const getResponse = await request.get(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
    });
    const getBody = await getResponse.json();
    expect(getBody.responseData.items).toHaveLength(1);
    expect(getBody.responseData.items[0].quantity).toBe(2);
    expect(getBody.responseData.items[0].clothe._id).toBe(clotheId);
  });
});

test.describe("Orders API", () => {
  test("POST /orders is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      data: { shippingAddress: "123 Playwright Ave" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /orders rejects a request with no shipping address", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      headers: authHeader(token),
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/shipping address is required/i);
  });

  test("POST /orders rejects placing an order with an empty cart", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      headers: authHeader(token),
      data: { shippingAddress: "123 Playwright Ave" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/cart is empty/i);
  });

  test("POST /orders places an order for a member with a filled cart, returning 201", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: [{ clotheId, quantity: 1 }] },
    });

    const response = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      headers: authHeader(token),
      data: { shippingAddress: "123 Playwright Ave, Test City", paymentMethod: "cod" },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.order.status).toBe("pending");
    expect(body.responseData.order.items).toHaveLength(1);
  });

  test("GET /orders/me is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/orders/me`);
    expect(response.status()).toBe(401);
  });

  test("GET /orders/me lists only the caller's own orders", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: [{ clotheId, quantity: 1 }] },
    });
    const createResponse = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      headers: authHeader(token),
      data: { shippingAddress: "456 Playwright Blvd" },
    });
    const createdId = (await createResponse.json()).responseData.order._id;

    const response = await request.get(`${API_BASE_URL}/api/v1/orders/me`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.orders.some((o: { _id: string }) => o._id === createdId)).toBe(true);
  });

  test("GET /orders/:id is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/orders/64b000000000000000000000`);
    expect(response.status()).toBe(401);
  });

  test("GET /orders/:id returns 404 for a nonexistent order", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.get(`${API_BASE_URL}/api/v1/orders/64b000000000000000000000`, {
      headers: authHeader(token),
    });
    expect(response.status()).toBe(404);
  });

  test("GET /orders/:id is forbidden when the order belongs to a different user", async ({ request }) => {
    const owner = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(owner.token),
      data: { items: [{ clotheId, quantity: 1 }] },
    });
    const createResponse = await request.post(`${API_BASE_URL}/api/v1/orders`, {
      headers: authHeader(owner.token),
      data: { shippingAddress: "789 Playwright Way" },
    });
    const orderId = (await createResponse.json()).responseData.order._id;

    const intruder = await createAuthedMember();
    const response = await request.get(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
      headers: authHeader(intruder.token),
    });

    expect(response.status()).toBe(403);
  });
});
