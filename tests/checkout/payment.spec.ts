import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Checkout - Payment", () => {
  test("should select eSewa as the payment method", async ({ page, request }) => {
    const { payload, token } = await createAuthedMember();
    const clotheId = await getCatalogClotheId(request);

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
    await expect(page.locator("#checkout-btn")).toBeEnabled();
    await page.locator("#checkout-btn").click();

    const modal = page.locator(".fixed.inset-0.z-50");
    await modal.getByText("eSewa", { exact: true }).click();

    await expect(modal.locator('input[value="esewa"]')).toBeChecked();
    await expect(modal.getByText(/redirected to eSewa/i)).toBeVisible();
  });
});
