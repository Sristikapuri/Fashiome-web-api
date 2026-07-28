import { test, expect } from "@playwright/test";
import { createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


test.describe("Profile - Edit Profile", () => {
  test("should update the profile name", async ({ page }) => {
    const { payload } = await createAuthedMember();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await page.goto("/dashboard/profile");

    await page.locator('input[name="firstName"]').fill("Jordan");
    await page.locator('input[name="lastName"]').fill("Rivera");
    await page.getByRole("button", { name: "Save profile" }).click();

    await expect(page.getByText(/updated successfully/i)).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toHaveValue("Jordan");
    await expect(page.locator('input[name="lastName"]')).toHaveValue("Rivera");

    // Also confirm it truly persisted server-side, not just in memory.
    await page.reload();
    await expect(page.locator('input[name="firstName"]')).toHaveValue("Jordan", { timeout: 15_000 });
    await expect(page.locator('input[name="lastName"]')).toHaveValue("Rivera");
  });
});
