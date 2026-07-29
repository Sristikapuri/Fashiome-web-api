import { test, expect } from "../fixtures";
import { createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";



test.describe("Onboarding - Silhouette", () => {
  test("should save a silhouette profile through the 3-step wizard", async ({ page }) => {
    const { payload } = await createAuthedMember();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/silhouette");

    
    await page.getByRole("button", { name: /^♂/ }).click();
    await page.getByRole("button", { name: "ATHLETIC" }).click();
    await page.getByRole("button", { name: "CONTINUE" }).click();


    await page.getByRole("button", { name: "CONFIRM SELECTION" }).click();


    await page.getByRole("button", { name: "ANALYSE MY STYLE" }).click();

    await page.waitForURL("**/dashboard");
  });
});
