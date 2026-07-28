import type { Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  /** The `role="alert"` banner used for API/validation errors across the auth forms. */
  get errorAlert() {
    return this.page.getByRole("alert");
  }
}
