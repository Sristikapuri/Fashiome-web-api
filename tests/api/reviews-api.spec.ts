import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";


test.describe("Reviews API", () => {
  test("POST /reviews creates a review and returns 201", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const response = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 4, title: "Solid", comment: "Fits well and looks great." },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData).toMatchObject({ clotheId, rating: 4, comment: "Fits well and looks great." });
  });
});
