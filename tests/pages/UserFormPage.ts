import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { AdminUserPayload } from "../test-data/users";

export class UserFormPage extends BasePage {
  readonly firstNameInput = this.page.locator('input[name="firstName"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"]');
  readonly emailInput = this.page.locator('input[name="email"]');
  readonly usernameInput = this.page.locator('input[name="username"]');
  readonly passwordInput = this.page.locator('input[name="password"]');
  readonly genderSelect = this.page.locator('select[name="gender"]');
  readonly ageInput = this.page.locator('input[name="age"]');
  readonly roleSelect = this.page.locator('select[name="role"]');
  readonly statusSelect = this.page.locator('select[name="status"]');
  readonly submitButton = this.page.getByRole("button", { name: /create user|creating/i });

  constructor(page: Page) {
    super(page);
  }

  async fill(data: Partial<AdminUserPayload>) {
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.username !== undefined) await this.usernameInput.fill(data.username);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.gender !== undefined) await this.genderSelect.selectOption(data.gender);
    if (data.age !== undefined) await this.ageInput.fill(String(data.age));
    if (data.role !== undefined) await this.roleSelect.selectOption(data.role);
    if (data.status !== undefined) await this.statusSelect.selectOption(data.status);
  }

  async submit() {
    await this.submitButton.click();
  }

  async create(data: Partial<AdminUserPayload>) {
    await this.fill(data);
    await this.submit();
  }
}
