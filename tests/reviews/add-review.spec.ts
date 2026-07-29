import { test, expect } from "../fixtures";
import { API_BASE_URL, createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Reviews - Add Review", () => {
  test("should submit a review with a comment", async ({ page, request }) => {
    const { payload } = await createAuthedMember();

    const catalogResponse = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=1`);
    const catalogBody = await catalogResponse.json();
    const itemName: string = catalogBody.responseData.data[0].name;

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard?tab=shop");
    await page.getByPlaceholder("Search products...").fill(itemName);

    const card = page.locator("article", { hasText: itemName }).first();
    await card.getByTitle("Write a review").click();

    const modal = page.locator(".fixed.inset-0.z-50");
    const modalHeading = modal.getByRole("heading", { name: itemName, exact: true });
    await expect(modalHeading).toBeVisible();

    
    await modal.locator("button:has(svg.lucide-star)").nth(3).click();
    await modal.getByPlaceholder("Share your thoughts about this product...").fill("Great quality and true to size.");
    await modal.getByRole("button", { name: "Submit Review" }).click();

    await expect(modalHeading).not.toBeVisible();
  });
});
