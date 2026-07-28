import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class UsersListPage extends BasePage {
  readonly heading = this.page.getByRole("heading", { name: /user management/i });
  readonly createUserLink = this.page.getByRole("link", { name: /create user/i });
  readonly searchInput = this.page.locator('input[name="search"]');
  readonly searchButton = this.page.getByRole("button", { name: /^search$/i });
  readonly rowsPerPageSelect = this.page.getByLabel("Rows");
  readonly rows = this.page.locator("tbody tr");
  readonly emptyState = this.page.getByText(/no users found/i);
  readonly nextPageButton = this.page.getByRole("button", { name: /next/i });
  readonly prevPageButton = this.page.getByRole("button", { name: /prev/i });
  readonly deleteDialog = this.page.getByRole("dialog");
  readonly deleteConfirmButton = this.deleteDialog.getByRole("button", { name: /^delete$/i });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.adminUsers);
  }

  rowByEmail(email: string) {
    return this.page.locator("tbody tr", { hasText: email });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async editUser(email: string) {
    await this.rowByEmail(email).getByRole("link", { name: /edit/i }).click();
  }

  async deleteUser(email: string) {
    await this.rowByEmail(email).getByRole("button", { name: /delete/i }).click();
    await this.deleteConfirmButton.click();
  }
}
