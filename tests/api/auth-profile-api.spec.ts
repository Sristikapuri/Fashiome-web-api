import { test, expect } from "@playwright/test";
import {
  API_BASE_URL,
  authHeader,
  createAuthedMember,
  getAdminToken,
} from "../utils/api-client";
import { ADMIN_CREDENTIALS, buildRegisterPayload } from "../test-data/users";
import { uniqueEmail, uniqueUsername } from "../utils/random";

/**
 * Direct API coverage for the auth/user endpoints (/api/v1/auth/*), hitting
 * the backend with the `request` fixture instead of driving the UI. See
 * tests/api/api-verification.spec.ts for the equivalent page.waitForResponse
 * pattern used against real form submissions.
 */
test.describe("Auth API — register", () => {
  test("POST /auth/register creates a user and returns 201 with a sanitized body", async ({ request }) => {
    const payload = buildRegisterPayload();
    const { confirmPassword, ...rest } = payload;

    const response = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: { ...rest, age: Number(rest.age) },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.email).toBe(payload.email);
    expect(body.responseData.username).toBe(payload.username);
    expect(body.responseData.password).toBeUndefined();
  });

  test("POST /auth/register rejects a payload missing required fields with 400 + field errors", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: { email: uniqueEmail(), password: "Passw0rd!" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
    expect(Array.isArray(body.responseData.errors)).toBe(true);
    expect(body.responseData.errors.length).toBeGreaterThan(0);
  });

  test("POST /auth/register rejects a password shorter than 6 characters", async ({ request }) => {
    const payload = buildRegisterPayload({ password: "123", confirmPassword: "123" });
    const { confirmPassword, ...rest } = payload;

    const response = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: { ...rest, age: Number(rest.age) },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseData.errors.some((e: { field: string }) => e.field === "password")).toBe(true);
  });

  test("POST /auth/register rejects a duplicate email with a 400", async ({ request }) => {
    const { payload } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/auth/register`, {
      data: { ...payload, username: uniqueUsername(), age: Number(payload.age), confirmPassword: undefined },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
    expect(body.responseMessage).toMatch(/already registered/i);
  });
});

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

  test("POST /auth/login rejects an incorrect password with a 400 and no token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_CREDENTIALS.email, password: "definitely-wrong" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
    expect(body.responseMessage).toMatch(/invalid credentials/i);
  });

  test("POST /auth/login rejects an email that isn't registered", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: uniqueEmail("nobody"), password: "Passw0rd!" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
  });

  test("POST /auth/login rejects a payload missing the password field", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/login`, {
      data: { email: ADMIN_CREDENTIALS.email },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
    expect(body.responseMessage).toMatch(/validation failed/i);
  });
});

test.describe("Auth API — whoami", () => {
  test("GET /auth/whoami is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/auth/whoami`);
    expect(response.status()).toBe(401);
  });

  test("GET /auth/whoami is rejected with a malformed token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/auth/whoami`, {
      headers: authHeader("not-a-real-jwt"),
    });
    expect(response.status()).toBe(401);
  });

  test("GET /auth/whoami returns the caller's own account for a valid token", async ({ request }) => {
    const { payload, token } = await createAuthedMember();

    const response = await request.get(`${API_BASE_URL}/api/v1/auth/whoami`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.email).toBe(payload.email);
  });
});

test.describe("Auth API — update / delete logged-in user", () => {
  test("PUT /auth/update is rejected without a bearer token", async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/api/v1/auth/update`, {
      data: { firstName: "Nope" },
    });
    expect(response.status()).toBe(401);
  });

  test("PUT /auth/update applies a profile change for the authenticated user", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.put(`${API_BASE_URL}/api/v1/auth/update`, {
      headers: authHeader(token),
      data: { firstName: "UpdatedName" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.firstName).toBe("UpdatedName");
  });

  test("DELETE /auth/delete is rejected without a bearer token", async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/api/v1/auth/delete`);
    expect(response.status()).toBe(401);
  });

  test("DELETE /auth/delete removes the authenticated user's own account", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.delete(`${API_BASE_URL}/api/v1/auth/delete`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);

    const whoami = await request.get(`${API_BASE_URL}/api/v1/auth/whoami`, {
      headers: authHeader(token),
    });
    expect(whoami.status()).toBe(401);
  });
});

test.describe("Auth API — forgot / reset password", () => {
  test("POST /auth/forgot-password returns a generic success message for a registered email", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      data: { email: ADMIN_CREDENTIALS.email },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseMessage).toMatch(/reset link has been sent/i);
  });

  test("POST /auth/forgot-password returns the same generic message for an unregistered email (no enumeration)", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      data: { email: uniqueEmail("ghost") },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseMessage).toMatch(/reset link has been sent/i);
  });

  test("POST /auth/forgot-password rejects a request with no email", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      data: {},
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
  });

  test("POST /auth/reset-password rejects an invalid/expired reset code", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      data: { email: ADMIN_CREDENTIALS.email, token: "000000", password: "NewPassw0rd!" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
    expect(body.responseMessage).toMatch(/invalid or expired reset code/i);
  });

  test("POST /auth/reset-password rejects a request missing required fields", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      data: { email: ADMIN_CREDENTIALS.email },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.isSuccess).toBe(false);
  });
});

test.describe("Auth API — style archive", () => {
  test("GET /auth/style-archive is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/auth/style-archive`);
    expect(response.status()).toBe(401);
  });

  test("GET /auth/style-archive returns an empty archive for a freshly registered user", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.get(`${API_BASE_URL}/api/v1/auth/style-archive`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.styleArchive).toEqual([]);
  });

  test("POST /auth/style-archive rejects a payload missing weekKey/day/occasion", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/auth/style-archive`, {
      headers: authHeader(token),
      data: { title: "Incomplete entry" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/week key, day, and occasion/i);
  });

  test("POST /auth/style-archive upserts an entry and returns it in the archive", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.post(`${API_BASE_URL}/api/v1/auth/style-archive`, {
      headers: authHeader(token),
      data: { weekKey: "2026-W05", day: "Monday", occasion: "Office", title: "Test Look" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.isSuccess).toBe(true);
    expect(body.responseData.styleArchive).toHaveLength(1);
    expect(body.responseData.styleArchive[0]).toMatchObject({
      weekKey: "2026-W05",
      day: "Monday",
      occasion: "Office",
      title: "Test Look",
    });
  });
});

test.describe("Auth API — admin token sanity", () => {
  test("the seeded admin token resolves via whoami with role=admin", async ({ request }) => {
    const token = await getAdminToken();

    const response = await request.get(`${API_BASE_URL}/api/v1/auth/whoami`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.role).toBe("admin");
  });
});
