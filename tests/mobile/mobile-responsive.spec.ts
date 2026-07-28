import { test, expect } from "@playwright/test";

/**
 * There's no ".mobile-menu-toggle" / ".mobile-menu" hamburger anywhere in
 * this app — the homepage nav is duplicated behind a CSS breakpoint and the
 * dashboard sidebar just becomes a horizontally-scrollable icon bar, neither
 * of which is a JS-driven toggle. The onboarding carousel (previously used
 * here) has been removed from the app entirely, so this now uses the login
 * form's password show/hide toggle — a real, single-instance, unauthenticated
 * interactive element that visibly changes the screen.
 */
test.describe("Mobile Responsive", () => {
  test("should toggle password visibility on a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");

    const passwordInput = page.getByLabel("Password", { exact: true });
    await passwordInput.fill("Passw0rd!");
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();

    await expect(passwordInput).toHaveAttribute("type", "text");
  });
});
