import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByLabel("Email Address");
  readonly passwordInput = this.page.getByLabel("Password", { exact: true });
  readonly submitButton = this.page.getByRole("button", { name: /login to my wardrobe|signing in/i });
  readonly forgotPasswordLink = this.page.getByRole("link", { name: /forgot password/i });
  readonly registerLink = this.page.getByRole("link", { name: /^register$/i });
  /**
   * Scoped to the form because `getByRole("alert")` also matches Next.js's
   * global `#__next-route-announcer__` live region, which triggers a strict
   * mode violation on `this.page.getByRole("alert")` (see BasePage.errorAlert).
   */
  readonly formError = this.page.locator("form").getByRole("alert");

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.login);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
