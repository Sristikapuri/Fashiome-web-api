import type { Page, APIRequestContext } from "@playwright/test";
import { test, expect } from "../fixtures";
import { API_BASE_URL, authHeader, createAuthedMember, getCatalogClotheId } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


async function seedCartAndOpenCheckout(page: Page, request: APIRequestContext) {
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

  return page.locator(".fixed.inset-0.z-50");
}

test.describe("Checkout - Checkout Flow", () => {
  test("should fill shipping information", async ({ page, request }) => {
    const modal = await seedCartAndOpenCheckout(page, request);

    await modal.getByPlaceholder("Full Name *").fill("John Doe");
    await modal.getByPlaceholder("Email Address *").fill("john.doe@example.com");
    await modal.getByPlaceholder("Phone Number *").fill("9876543210");
    await modal.getByPlaceholder("Street Address *").fill("123 Test Street");
    await modal.getByPlaceholder("City *").fill("Kathmandu");
    await modal.getByPlaceholder("Postal Code *").fill("44600");

    await expect(modal.getByPlaceholder("Full Name *")).toHaveValue("John Doe");
  });

  test("should place order successfully", async ({ page, request }) => {
    const modal = await seedCartAndOpenCheckout(page, request);

    await modal.getByPlaceholder("Full Name *").fill("John Doe");
    
    await modal.getByPlaceholder("Email Address *").fill("sonyadhikari2021@gmail.com");
    await modal.getByPlaceholder("Phone Number *").fill("9876543210");
    await modal.getByPlaceholder("Street Address *").fill("123 Test Street");
    await modal.getByPlaceholder("City *").fill("Kathmandu");
    await modal.getByPlaceholder("Postal Code *").fill("44600");
    await modal.getByRole("button", { name: /Place Order/ }).click();

   
    await expect(modal.getByRole("heading", { name: /Order Placed/ })).toBeVisible({ timeout: 45_000 });
  });

  test("should show a validation error when required fields are missing", async ({ page, request }) => {
    const modal = await seedCartAndOpenCheckout(page, request);

   
    await modal.getByPlaceholder("Full Name *").fill(" ");
    await modal.getByPlaceholder("Email Address *").fill("a@a.com");
    await modal.getByPlaceholder("Phone Number *").fill(" ");
    await modal.getByPlaceholder("Street Address *").fill(" ");
    await modal.getByPlaceholder("City *").fill(" ");
    await modal.getByPlaceholder("Postal Code *").fill(" ");
    await modal.getByRole("button", { name: /Place Order/ }).click();

    await expect(modal.getByText("Please fill in all required fields.")).toBeVisible();
  });
});
