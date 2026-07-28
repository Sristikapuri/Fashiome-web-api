import { test, expect } from "@playwright/test";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { buildRegisterPayload } from "../test-data/users";
import { registerUserViaApi } from "../utils/api-client";

/**
 * The full MailHog round-trip test was removed — it needs a MailHog inbox
 * running locally, which isn't available in this environment. This tests
 * the same page's real backend rejection ("Invalid or expired reset code",
 * see Fashiome_Backend/src/controllers/user.controller.ts:360) without
 * depending on an actual email ever being sent.
 */
test.describe("Reset password", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("rejects an invalid or expired reset code", async ({ page }) => {
    const payload = buildRegisterPayload();
    const registerResult = await registerUserViaApi(payload);
    expect(registerResult.isSuccess).toBe(true);

    const resetPasswordPage = new ResetPasswordPage(page);
    await resetPasswordPage.gotoFromResetLink(
      `/reset-password?email=${encodeURIComponent(payload.email)}&token=not-a-real-reset-code`
    );

    await expect(resetPasswordPage.emailInput).toHaveValue(payload.email);
    await resetPasswordPage.resetPassword("BrandNewPass1!");

    await expect(page.getByText(/invalid or expired reset code/i)).toBeVisible();
  });
});
