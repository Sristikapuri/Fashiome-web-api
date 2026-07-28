import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class ResetPasswordPage extends BasePage {
  readonly emailInput = this.page.getByLabel("Email Address");
  readonly tokenInput = this.page.getByLabel("Reset Code");
  readonly passwordInput = this.page.getByLabel("New Password");
  readonly confirmPasswordInput = this.page.getByLabel("Confirm Password");
  readonly submitButton = this.page.getByRole("button", { name: /reset password|resetting/i });
  readonly successMessage = this.page.locator("p", { hasText: /password has been reset successfully/i });

  constructor(page: Page) {
    super(page);
  }

  /** Navigate using the full link pulled out of the reset email (carries ?email=&token=). */
  async gotoFromResetLink(resetLink: string) {
    await this.page.goto(resetLink);
  }

  async goto() {
    await super.goto(ROUTES.resetPassword);
  }

  async resetPassword(newPassword: string) {
    await this.passwordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(newPassword);
    await this.submitButton.click();
  }
}
