import { test, expect } from "../fixtures";
import { API_BASE_URL } from "../utils/api-client";
import { ADMIN_CREDENTIALS } from "../test-data/users";

test.describe("Auth API — login", () => {
  test("POST /auth/login returns a token and sanitized user for valid credentials", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_CREDENTIALS.email, password: ADMIN_CREDENTIALS.password },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.token).toBeTruthy();
    expect(body.responseData.user.email).toBe(ADMIN_CREDENTIALS.email);
    expect(body.responseData.user.password).toBeUndefined();
  });
});
