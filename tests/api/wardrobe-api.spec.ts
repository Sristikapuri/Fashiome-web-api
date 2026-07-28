import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";

/**
 * Direct API coverage for /api/v1/home/wardrobe/* (plain DB-backed CRUD) plus
 * auth-gating checks for the AI-backed /home endpoints (dashboard,
 * generate-outfit, assistant-chat, search, generate-profile, trends). Those
 * AI endpoints call out to Gemini/OpenAI on the happy path, so only their
 * 401-without-token gating is asserted here to keep the suite fast and
 * deterministic — the wardrobe CRUD below covers real request/response
 * behavior without touching the AI providers.
 */
test.describe("Home Wardrobe API", () => {
  test("GET /home/wardrobe is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/wardrobe`);
    expect(response.status()).toBe(401);
  });

  test("GET /home/wardrobe returns an empty array for a freshly registered member", async ({ request }) => {
    const { token } = await createAuthedMember();

    const response = await request.get(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData).toEqual([]);
  });

  test("POST /home/wardrobe is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      data: { title: "Weekend Look" },
    });
    expect(response.status()).toBe(401);
  });

  test("wardrobe CRUD lifecycle: add, list, patch, sync and delete an item", async ({ request }) => {
    const { token } = await createAuthedMember();

    const addResponse = await request.post(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
      data: { title: "Weekend Brunch Look", category: "casual", tag: "brunch" },
    });
    expect(addResponse.status()).toBe(200);
    const added = (await addResponse.json()).responseData;
    expect(added.id).toBeTruthy();
    expect(added.title).toBe("Weekend Brunch Look");

    const listResponse = await request.get(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
    });
    const listBody = await listResponse.json();
    expect(listBody.responseData).toHaveLength(1);

    const patchResponse = await request.patch(`${API_BASE_URL}/api/v1/home/wardrobe/${added.id}`, {
      headers: authHeader(token),
      data: { isFavorite: true },
    });
    expect(patchResponse.status()).toBe(200);
    const patched = (await patchResponse.json()).responseData;
    expect(patched.isFavorite).toBe(true);

    const syncResponse = await request.post(`${API_BASE_URL}/api/v1/home/wardrobe/sync`, {
      headers: authHeader(token),
      data: { items: [added, { ...added, id: "second-item" }] },
    });
    expect(syncResponse.status()).toBe(200);
    expect((await syncResponse.json()).responseData.count).toBe(2);

    const deleteResponse = await request.delete(`${API_BASE_URL}/api/v1/home/wardrobe/${added.id}`, {
      headers: authHeader(token),
    });
    expect(deleteResponse.status()).toBe(200);
    expect((await deleteResponse.json()).responseData.count).toBe(1);
  });

  test("POST /home/wardrobe/sync is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/wardrobe/sync`, {
      data: { items: [] },
    });
    expect(response.status()).toBe(401);
  });
});

test.describe("Home AI endpoints — auth gating", () => {
  test("GET /home/dashboard is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/dashboard`);
    expect(response.status()).toBe(401);
  });

  test("GET /home/trends is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/home/trends`);
    expect(response.status()).toBe(401);
  });

  test("POST /home/generate-outfit is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/generate-outfit`, {
      data: { occasion: "Weekend" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /home/assistant-chat is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/assistant-chat`, {
      data: { message: "What should I wear?" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /home/search is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/search`, {
      data: { query: "blazer" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /home/generate-profile is rejected without a bearer token", async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/api/v1/home/generate-profile`, {
      data: {},
    });
    expect(response.status()).toBe(401);
  });
});
