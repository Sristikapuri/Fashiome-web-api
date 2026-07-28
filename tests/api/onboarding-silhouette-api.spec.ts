import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";

/** Direct API coverage for /api/v1/onboarding/* and /api/v1/silhouette/*. */
test.describe("Onboarding API", () => {
  test("GET /onboarding/status is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/onboarding/status`);
    expect(response.status()).toBe(401);
  });

  test("POST /onboarding/complete is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/onboarding/complete`, {
      data: { preferences: {} },
    });
    expect(response.status()).toBe(401);
  });

  // Sequential: status auto-creates the onboarding record, complete() consumes it,
  // and completing a second time must be rejected — each step depends on the last.
  test.describe.serial("status -> complete -> already-completed", () => {
    let token: string;

    test.beforeAll(async () => {
      ({ token } = await createAuthedMember());
    });

    test("GET /onboarding/status auto-creates an incomplete record for a new user", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/v1/onboarding/status`, {
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseData.completed).toBe(false);
    });

    test("POST /onboarding/complete marks onboarding as completed", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/v1/onboarding/complete`, {
        headers: authHeader(token),
        data: { preferences: { style: "minimal", size: "M", color: "neutral" } },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseData.completed).toBe(true);
    });

    test("POST /onboarding/complete rejects completing an already-completed onboarding", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/v1/onboarding/complete`, {
        headers: authHeader(token),
        data: { preferences: {} },
      });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.responseMessage).toMatch(/already completed/i);
    });
  });
});

test.describe("Silhouette API", () => {
  test("GET /silhouette/profile is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/silhouette/profile`);
    expect(response.status()).toBe(401);
  });

  test("POST /silhouette/profile is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/silhouette/profile`, {
      data: { bodyType: "hourglass" },
    });
    expect(response.status()).toBe(401);
  });

  test("DELETE /silhouette/profile returns 404 when no profile exists yet for the user", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.delete(`${API_BASE_URL}/api/v1/silhouette/profile`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/not found/i);
  });

  // Sequential: get auto-creates a blank profile, post saves real data over it,
  // and delete clears it — each assertion depends on the prior step's state.
  test.describe.serial("get -> save -> clear", () => {
    let token: string;

    test.beforeAll(async () => {
      ({ token } = await createAuthedMember());
    });

    test("GET /silhouette/profile auto-creates an incomplete profile", async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/api/v1/silhouette/profile`, {
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseData.completed).toBe(false);
    });

    test("POST /silhouette/profile saves body measurements and marks it completed", async ({ request }) => {
      const response = await request.post(`${API_BASE_URL}/api/v1/silhouette/profile`, {
        headers: authHeader(token),
        data: { bodyType: "hourglass", height: 168, weight: 60, skinTone: "warm" },
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseData.completed).toBe(true);
      expect(body.responseData.bodyType).toBe("hourglass");
    });

    test("DELETE /silhouette/profile clears a previously saved profile", async ({ request }) => {
      const response = await request.delete(`${API_BASE_URL}/api/v1/silhouette/profile`, {
        headers: authHeader(token),
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.isSuccess).toBe(true);

      const after = await request.get(`${API_BASE_URL}/api/v1/silhouette/profile`, {
        headers: authHeader(token),
      });
      const afterBody = await after.json();
      expect(afterBody.responseData.completed).toBe(false);
    });
  });
});
