import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Wardrobe - Organize Wardrobe", () => {
  test("should filter wardrobe items by category", async ({ page, request }) => {
    const { payload, token } = await createAuthedMember();
    const topTitle = `E2E Top ${Date.now()}`;
    const bottomTitle = `E2E Bottom ${Date.now()}`;

    await request.post(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
      data: { title: topTitle, category: "Tops" },
    });
    await request.post(`${API_BASE_URL}/api/v1/home/wardrobe`, {
      headers: authHeader(token),
      data: { title: bottomTitle, category: "Bottoms" },
    });

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard?tab=wardrobe");

    await expect(page.getByRole("heading", { level: 3, name: topTitle, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: bottomTitle, exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Tops", exact: true }).click();

    await expect(page.getByRole("heading", { level: 3, name: topTitle, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: bottomTitle, exact: true })).not.toBeVisible();
  });
});
