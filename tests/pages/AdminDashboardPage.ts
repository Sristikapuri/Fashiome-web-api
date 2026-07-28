import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class AdminDashboardPage extends BasePage {
  readonly heading = this.page.getByRole("heading", { name: /style studio control room/i });
  readonly nav = this.page.getByRole("navigation", { name: /admin sections/i });
  readonly overviewLink = this.nav.getByRole("link", { name: /overview/i });
  readonly usersLink = this.nav.getByRole("link", { name: /^users$/i });
  readonly clothesLink = this.nav.getByRole("link", { name: /^clothes$/i });
  readonly ordersLink = this.nav.getByRole("link", { name: /^orders$/i });
  readonly backToDashboardLink = this.page.getByRole("link", { name: /back to dashboard/i });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.admin);
  }
}
