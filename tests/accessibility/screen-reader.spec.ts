import { test, expect } from "@playwright/test";

test.describe("Accessibility - Screen Reader", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have alt text on images", async ({ page }) => {
    const images = page.locator("img:not([alt])");
    const count = await images.count();
    
    expect(count).toBe(0);
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    const h1 = await page.locator("h1").count();
    expect(h1).toBe(1);
  });

  test("should have descriptive link text", async ({ page }) => {
    const links = page.locator("a");
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const hasText = text && text.trim().length > 0;
      const hasAriaLabel = await link.getAttribute("aria-label");
      
      expect(hasText || hasAriaLabel).toBe(true);
    }
  });
});
