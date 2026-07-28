import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";
import type { RegisterPayload } from "../test-data/users";

export class RegisterPage extends BasePage {
  readonly firstNameInput = this.page.getByLabel("First Name");
  readonly lastNameInput = this.page.getByLabel("Last Name");
  readonly usernameInput = this.page.getByLabel("Username");
  readonly emailInput = this.page.getByLabel("Email Address");
  readonly genderSelect = this.page.getByLabel("Gender");
  readonly ageInput = this.page.getByLabel("Age");
  readonly passwordInput = this.page.getByLabel("Password", { exact: true });
  readonly confirmPasswordInput = this.page.getByLabel("Confirm Password");
  readonly termsCheckbox = this.page.getByRole("checkbox");
  readonly submitButton = this.page.getByRole("button", { name: /create account|creating account/i });
  readonly successPanel = this.page.getByRole("status");
  readonly loginLink = this.page.getByRole("link", { name: /^login$/i });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.register);
  }

  async fill(data: RegisterPayload) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.usernameInput.fill(data.username);
    await this.emailInput.fill(data.email);
    await this.genderSelect.selectOption(data.gender);
    await this.ageInput.fill(String(data.age));
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async register(data: RegisterPayload) {
    await this.fill(data);
    await this.acceptTerms();
    await this.submit();
  }
}
