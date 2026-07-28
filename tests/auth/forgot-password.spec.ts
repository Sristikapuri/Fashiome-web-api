import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { buildRegisterPayload } from "../test-data/users";
import { registerUserViaApi } from "../utils/api-client";
import { ROUTES } from "../test-data/routes";

test.describe("Forgot password", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("requires an email before submitting", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitButton.click();

    await expect(page.getByText(/email is required/i)).toBeVisible();
  });

  test("shows the same generic success message for a registered email", async ({ page }) => {
    const payload = buildRegisterPayload();
    const result = await registerUserViaApi(payload);
    expect(result.isSuccess).toBe(true);

    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(payload.email);

    await expect(forgotPasswordPage.successMessage).toBeVisible();
  });

  test("shows the same generic message for an email that isn't registered (no account enumeration)", async ({
    page,
  }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset("definitely-not-registered@fashiome-e2e.test");

    await expect(forgotPasswordPage.successMessage).toBeVisible();
  });

  test("links back to login and to the reset-password page", async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();

    await forgotPasswordPage.backToLoginLink.click();
    await expect(page).toHaveURL(new RegExp(`${ROUTES.login}$`));
  });
});
