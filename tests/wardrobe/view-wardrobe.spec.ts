import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Wardrobe - View Wardrobe", () => {
  test("should toggle favorite status of a wardrobe item", async ({ page, request }) => {
    const { payload, token } = await createAuthedMember();
    const itemTitle = `E2E Wardrobe Item ${Date.now()}`;

    const addResponse = await request.post(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
      data: { title: itemTitle, category: "Tops" },
    });
    expect(addResponse.status()).toBe(200);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard?tab=wardrobe");

    const heading = page.getByRole("heading", { level: 3, name: itemTitle, exact: true });
    await expect(heading).toBeVisible();

    const card = heading.locator("xpath=ancestor::div[contains(@class,'group')][1]");
    const heartButton = card.locator("button").first();
    const heartIcon = heartButton.locator("svg");

    await expect(heartIcon).not.toHaveClass(/fill-current/);
    await heartButton.click();
    await expect(heartIcon).toHaveClass(/fill-current/);
  });
});
