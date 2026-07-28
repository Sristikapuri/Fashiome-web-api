import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";

/** Direct API coverage for /api/v1/reviews/* (create, list, my, update, delete + ownership rules). */
test.describe("Reviews API", () => {
  test("POST /reviews is rejected without a bearer token", async ({ request }) => {
    const clotheId = await getCatalogClotheId(request);
    const response = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      data: { clotheId, rating: 5, comment: "Great fit" },
    });
    expect(response.status()).toBe(401);
  });

  test("POST /reviews rejects a payload missing rating/comment", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const response = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/rating, and comment are required/i);
  });

  test("POST /reviews rejects a rating outside the 1-5 range", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const response = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 6, comment: "Too enthusiastic" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.responseMessage).toMatch(/rating must be between 1 and 5/i);
  });

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

  test("POST /reviews rejects a second review from the same user for the same clothe", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const first = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 5, comment: "First review" },
    });
    expect(first.status()).toBe(201);

    const second = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 3, comment: "Trying to review again" },
    });

    expect(second.status()).toBe(400);
    const body = await second.json();
    expect(body.responseMessage).toMatch(/already reviewed/i);
  });

  test("GET /reviews/clothe/:clotheId is public and returns reviews + rating stats", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 5, comment: "Public listing check" },
    });

    const response = await request.get(`${API_BASE_URL}/api/v1/reviews/clothe/${clotheId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.responseData.reviews)).toBe(true);
    expect(body.responseData.stats).toBeTruthy();
  });

  test("GET /reviews/my is rejected without a bearer token", async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/api/v1/reviews/my`);
    expect(response.status()).toBe(401);
  });

  test("GET /reviews/my returns only the caller's own reviews", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 4, comment: "My review" },
    });
    const createdId = (await created.json()).responseData._id;

    const response = await request.get(`${API_BASE_URL}/api/v1/reviews/my`, {
      headers: authHeader(token),
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.some((r: { _id: string }) => r._id === createdId)).toBe(true);
  });

  test("PUT /reviews/:id rejects an invalid rating", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 4, comment: "Initial" },
    });
    const id = (await created.json()).responseData._id;

    const response = await request.put(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(token),
      data: { rating: 7 },
    });

    expect(response.status()).toBe(400);
  });

  test("PUT /reviews/:id updates the review when called by its owner", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 3, comment: "Initial thoughts" },
    });
    const id = (await created.json()).responseData._id;

    const response = await request.put(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(token),
      data: { rating: 5, comment: "Updated — even better than I thought" },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseData.rating).toBe(5);
    expect(body.responseData.comment).toBe("Updated — even better than I thought");
  });

  test("PUT /reviews/:id is forbidden for a user who doesn't own the review", async ({ request }) => {
    const owner = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(owner.token),
      data: { clotheId, rating: 4, comment: "Owner's review" },
    });
    const id = (await created.json()).responseData._id;

    const intruder = await createAuthedMember();
    const response = await request.put(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(intruder.token),
      data: { rating: 1 },
    });

    expect(response.status()).toBe(403);
  });

  test("PUT /reviews/:id returns 404 for a nonexistent review", async ({ request }) => {
    const { token } = await createAuthedMember();
    const response = await request.put(`${API_BASE_URL}/api/v1/reviews/64b000000000000000000000`, {
      headers: authHeader(token),
      data: { rating: 5 },
    });
    expect(response.status()).toBe(404);
  });

  test("DELETE /reviews/:id is forbidden for a user who doesn't own the review", async ({ request }) => {
    const owner = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(owner.token),
      data: { clotheId, rating: 2, comment: "Owner's review for delete check" },
    });
    const id = (await created.json()).responseData._id;

    const intruder = await createAuthedMember();
    const response = await request.delete(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(intruder.token),
    });

    expect(response.status()).toBe(403);
  });

  test("DELETE /reviews/:id removes the review when called by its owner, then 404s on re-delete", async ({ request }) => {
    const { token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);
    const created = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 3, comment: "To be deleted" },
    });
    const id = (await created.json()).responseData._id;

    const deleteResponse = await request.delete(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(token),
    });
    expect(deleteResponse.status()).toBe(200);

    const redelete = await request.delete(`${API_BASE_URL}/api/v1/reviews/${id}`, {
      headers: authHeader(token),
    });
    expect(redelete.status()).toBe(404);
  });
});
