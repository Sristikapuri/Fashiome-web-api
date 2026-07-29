import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, createAuthedMember, getAdminToken } from "../utils/api-client";
import { buildClotheApiPayload } from "../test-data/clothes";
import { LoginPage } from "../pages/LoginPage";


test.describe("Reviews - View Aggregated Rating", () => {
  let adminToken: string;
  let createdClotheId: string | undefined;
  let createdReviewId: string | undefined;
  let memberToken: string | undefined;

  
  test.afterEach(async ({ request }) => {
    if (createdReviewId && memberToken) {
      await request.delete(`${API_BASE_URL}/api/v1/reviews/${createdReviewId}`, {
        headers: authHeader(memberToken),
      });
    }
    if (createdClotheId) {
      await request.delete(`${API_BASE_URL}/api/v1/admin/clothes/${createdClotheId}`, {
        headers: authHeader(adminToken),
      });
    }
    createdReviewId = undefined;
    createdClotheId = undefined;
    memberToken = undefined;
  });

  test("should show the aggregated review count on the product card after a review is added", async ({ page, request }) => {
    const { token, payload } = await createAuthedMember();
    memberToken = token;

    adminToken = await getAdminToken();
    const clothePayload = buildClotheApiPayload();
    const createClotheResponse = await request.post(`${API_BASE_URL}/api/v1/admin/clothes`, {
      headers: authHeader(adminToken),
      data: clothePayload,
    });
    expect(createClotheResponse.status()).toBe(201);
    const clotheId: string = (await createClotheResponse.json()).responseData._id;
    createdClotheId = clotheId;
    const itemName: string = clothePayload.name;

    const createResponse = await request.post(`${API_BASE_URL}/api/v1/reviews`, {
      headers: authHeader(token),
      data: { clotheId, rating: 5, comment: "Excellent quality and fits true to size." },
    });
    expect(createResponse.status()).toBe(201);
    createdReviewId = (await createResponse.json()).responseData._id;

    const statsResponse = await request.get(`${API_BASE_URL}/api/v1/reviews/clothe/${clotheId}`);
    const statsBody = await statsResponse.json();
    const totalReviews: number = statsBody.responseData.stats.totalReviews;

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard?tab=shop");
    await page.getByPlaceholder("Search products...").fill(itemName);

    const card = page.locator("article", { hasText: itemName }).first();
    await expect(card.getByText(`(${totalReviews})`)).toBeVisible();
  });
});
