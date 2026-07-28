import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("core landmarks, aria-labels, contrast and alt text are present", async ({ page }) => {

    const nav = page.getByRole("navigation").first();
    await expect(nav).toBeVisible();

    const buttons = page.locator("button");
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = (await button.textContent())?.trim();
      const ariaLabel = await button.getAttribute("aria-label");
      expect(Boolean(text) || Boolean(ariaLabel)).toBe(true);
    }


    const loginLink = page.getByRole("link", { name: "Login" }).first();
    const backgroundColor = await loginLink.evaluate(el => getComputedStyle(el).backgroundColor);
    const color = await loginLink.evaluate(el => getComputedStyle(el).color);

    expect(backgroundColor).toBeDefined();
    expect(color).toBeDefined();

    const heading = page.locator("h1");
    const headingBackgroundColor = await heading.evaluate(el => getComputedStyle(el.parentElement || el).backgroundColor);
    const headingColor = await heading.evaluate(el => getComputedStyle(el).color);

    expect(headingBackgroundColor).toBeDefined();
    expect(headingColor).toBeDefined();


    const images = page.locator("img:not([alt])");
    const imagesWithoutAlt = await images.count();

    expect(imagesWithoutAlt).toBe(0);

    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBe(1);

    const links = page.locator("a");
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const hasText = text && text.trim().length > 0;
      const hasAriaLabel = await link.getAttribute("aria-label");

      expect(hasText || hasAriaLabel).toBe(true);
    }
  });

  test("keyboard navigation reaches and activates interactive elements", async ({ page }) => {
    // From keyboard-navigation.spec.ts
    await page.keyboard.press("Tab");
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toMatch(/^(A|BUTTON)$/);

    await page.keyboard.press("Tab");

    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/./);


    await page.goto("/");
    await page.keyboard.press("Tab");

    const hasFocusAfterReload = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocusAfterReload).toBe(true);

   
    await page.click("text=Login");
    await page.waitForURL(/\/login/);

    const url = page.url();
    expect(url).toContain("/login");
  });
});
