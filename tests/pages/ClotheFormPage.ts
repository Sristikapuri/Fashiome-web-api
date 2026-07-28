import type { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import type { ClothePayload } from "../test-data/clothes";

export class ClotheFormPage extends BasePage {
  readonly nameInput = this.page.locator('input[name="name"]');
  readonly categorySelect = this.page.locator('select[name="category"]');
  readonly sizeInput = this.page.locator('input[name="size"]');
  readonly colorInput = this.page.locator('input[name="color"]');
  readonly priceInput = this.page.locator('input[name="price"]');
  readonly discountedPriceInput = this.page.locator('input[name="discountedPrice"]');
  readonly stockInput = this.page.locator('input[name="stock"]');
  readonly descriptionInput = this.page.locator('textarea[name="description"]');
  readonly statusSelect = this.page.locator('select[name="status"]');
  readonly submitButton = this.page.getByRole("button", { name: /create item|save changes|saving/i });
  readonly cancelButton = this.page.getByRole("button", { name: /cancel/i });
  readonly formError = this.page.locator("form >> text=/failed to save|something went wrong/i");
  readonly fieldError = (field: string) =>
    this.page.locator(`input[name="${field}"], select[name="${field}"], textarea[name="${field}"]`).locator(
      "xpath=following-sibling::span[1]"
    );

  constructor(page: Page) {
    super(page);
  }

  async fill(data: Partial<ClothePayload>) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.category !== undefined) await this.categorySelect.selectOption(data.category);
    if (data.size !== undefined) await this.sizeInput.fill(data.size);
    if (data.color !== undefined) await this.colorInput.fill(data.color);
    if (data.price !== undefined) await this.priceInput.fill(String(data.price));
    if (data.discountedPrice !== undefined) await this.discountedPriceInput.fill(String(data.discountedPrice));
    if (data.stock !== undefined) await this.stockInput.fill(String(data.stock));
    if (data.description !== undefined) await this.descriptionInput.fill(data.description);
    if (data.status !== undefined) await this.statusSelect.selectOption(data.status);
  }

  async submit() {
    await this.submitButton.click();
  }

  async save(data: Partial<ClothePayload>) {
    await this.fill(data);
    await this.submit();
  }
}
