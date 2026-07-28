import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ROUTES } from "../test-data/routes";

export class ClothesListPage extends BasePage {
  readonly heading = this.page.getByRole("heading", { name: /clothes management/i });
  readonly newItemLink = this.page.getByRole("link", { name: /new item/i });
  readonly searchInput = this.page.locator('input[name="search"]');
  readonly searchButton = this.page.getByRole("button", { name: /^search$/i });
  readonly categoryFilter = this.page.getByLabel("Category");
  readonly statusFilter = this.page.getByLabel("Status");
  readonly rowsPerPageSelect = this.page.getByLabel("Rows");
  readonly table = this.page.locator("table");
  readonly rows = this.page.locator("tbody tr");
  readonly emptyState = this.page.getByText(/no clothes found/i);
  readonly nextPageButton = this.page.getByRole("button", { name: /next/i });
  readonly prevPageButton = this.page.getByRole("button", { name: /prev/i });
  readonly pageIndicator = this.page.getByText(/^page \d+ of \d+$/i);
  readonly deleteDialog = this.page.getByRole("dialog");
  readonly deleteConfirmButton = this.deleteDialog.getByRole("button", { name: /^delete$/i });
  readonly deleteCancelButton = this.deleteDialog.getByRole("button", { name: /cancel/i });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(ROUTES.adminClothes);
  }

  rowByName(name: string) {
    return this.page.locator("tbody tr", { hasText: name });
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async viewItem(name: string) {
    await this.rowByName(name).getByLabel(`View ${name}`).click();
  }

  async editItem(name: string) {
    await this.rowByName(name).getByLabel(`Edit ${name}`).click();
  }

  async deleteItem(name: string) {
    await this.rowByName(name).getByLabel(`Delete ${name}`).click();
    await this.deleteConfirmButton.click();
  }
}
