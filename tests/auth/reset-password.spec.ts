import { test, expect } from "@playwright/test";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { LoginPage } from "../pages/LoginPage";
import { buildRegisterPayload } from "../test-data/users";
import { registerUserViaApi } from "../utils/api-client";
import { extractResetLink, waitForEmailTo } from "../utils/mailhog";

test.describe("Reset password (full email round trip via MailHog)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("requests a reset link, retrieves it from the inbox, resets the password, and logs in with it", async ({
    page,
  }) => {
    const payload = buildRegisterPayload();
    const registerResult = await registerUserViaApi(payload);
    expect(registerResult.isSuccess).toBe(true);

    const forgotPasswordPage = new ForgotPasswordPage(page);
    await forgotPasswordPage.goto();
    await forgotPasswordPage.requestReset(payload.email);
    await expect(forgotPasswordPage.successMessage).toBeVisible();

    const email = await waitForEmailTo(payload.email);
    const resetLink = extractResetLink(email);
    expect(resetLink).toContain("/reset-password");
    expect(resetLink).toContain(encodeURIComponent(payload.email));

    const resetPasswordPage = new ResetPasswordPage(page);
    const newPassword = "BrandNewPass1!";
    await resetPasswordPage.gotoFromResetLink(resetLink);

    // Email + token are pre-filled from the link's query params.
    await expect(resetPasswordPage.emailInput).toHaveValue(payload.email);
    await resetPasswordPage.resetPassword(newPassword);

    await expect(resetPasswordPage.successMessage).toBeVisible();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, newPassword);
    await page.waitForURL("**/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);

    // The old password must no longer work.
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await expect(loginPage.errorAlert).toBeVisible();
  });

  test("rejects a mismatched password confirmation client-side", async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.goto();

    await resetPasswordPage.emailInput.fill("someone@fashiome-e2e.test");
    await resetPasswordPage.tokenInput.fill("123456");
    await resetPasswordPage.passwordInput.fill("Passw0rd!");
    await resetPasswordPage.confirmPasswordInput.fill("Different1!");
    await resetPasswordPage.submitButton.click();

    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test("rejects a password shorter than 6 characters client-side", async ({ page }) => {
    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.goto();

    await resetPasswordPage.emailInput.fill("someone@fashiome-e2e.test");
    await resetPasswordPage.tokenInput.fill("123456");
    await resetPasswordPage.passwordInput.fill("123");
    await resetPasswordPage.confirmPasswordInput.fill("123");
    await resetPasswordPage.submitButton.click();

    await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
  });

  test("surfaces the backend error for an invalid or expired reset code", async ({ page }) => {
    const payload = buildRegisterPayload();
    await registerUserViaApi(payload);

    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.goto();

    await resetPasswordPage.emailInput.fill(payload.email);
    await resetPasswordPage.tokenInput.fill("000000-not-a-real-code");
    await resetPasswordPage.resetPassword("SomeNewPass1!");

    await expect(page.getByText(/invalid or expired reset code/i)).toBeVisible();
  });
});
