import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";


test.describe("Onboarding API", () => {
  
  
  test.describe.serial("status -> complete -> already-completed", () => {
    let token: string;

    test.beforeAll(async () => {
      ({ token } = await createAuthedMember());
    });

    test("POST /onboarding/complete marks onboarding as completed", async ({ request }) => {
      
      await request.get(`${API_BASE_URL}/api/v1/onboarding/status`, { headers: authHeader(token) });

      const response = await request.post(`${API_BASE_URL}/api/v1/onboarding/complete`, {
        headers: authHeader(token),
        data: { preferences: { style: "minimal", size: "M", color: "neutral" } },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseData.completed).toBe(true);
    });
  });
});
