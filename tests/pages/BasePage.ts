import type { Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

 
  get errorAlert() {
    return this.page.getByRole("alert");
  }
}
