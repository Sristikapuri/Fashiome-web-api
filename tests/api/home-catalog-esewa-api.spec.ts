import { test, expect } from "@playwright/test";
import { API_BASE_URL } from "../utils/api-client";


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
});
