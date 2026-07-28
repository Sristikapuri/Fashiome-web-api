import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Checkout - View Cart", () => {
  test("should increase the quantity of a bag item", async ({ page, request }) => {
    const { payload, token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

    const catalogResponse = await request.get(`${API_BASE_URL}/api/v1/home/clothes?limit=1`);
    const catalogBody = await catalogResponse.json();
    const itemName: string = catalogBody.responseData.data[0].name;

    const cartResponse = await request.put(`${API_BASE_URL}/api/v1/cart`, {
      headers: authHeader(token),
      data: { items: [{ clotheId, quantity: 1 }] },
    });
    expect(cartResponse.status()).toBe(200);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard?tab=shop");

    const bagItem = page
      .locator("aside")
      .getByText(itemName, { exact: true })
      .locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");

    await expect(bagItem.locator("span.w-8")).toHaveText("1");

    await bagItem.locator("button:has(svg.lucide-plus)").click();

    await expect(bagItem.locator("span.w-8")).toHaveText("2");
  });
});
