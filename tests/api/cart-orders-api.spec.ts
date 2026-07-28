import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";


test.describe("Cart API", () => {
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
