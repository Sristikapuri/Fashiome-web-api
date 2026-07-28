import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class ForgotPasswordPage extends BasePage {
  readonly emailInput = this.page.getByLabel("Email Address");
  readonly submitButton = this.page.getByRole("button", { name: /send reset link|sending link/i });
  readonly successMessage = this.page.locator("p", { hasText: /reset link has been sent/i });
  readonly backToLoginLink = this.page.getByRole("link", { name: /back to login/i });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.forgotPassword);
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
