import path from "node:path";
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

async function hasHorizontalOverflow(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
}

test.describe("Responsive layout — public pages", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("login page has no horizontal overflow and the form is usable", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    expect(await hasHorizontalOverflow(page)).toBe(false);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test("register page has no horizontal overflow", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    expect(await hasHorizontalOverflow(page)).toBe(false);
    await expect(registerPage.submitButton).toBeVisible();
  });
});

test.describe("Responsive layout — admin dashboard", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

  test("admin dashboard has no horizontal overflow and the overview is reachable", async ({ page }) => {
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();

    expect(await hasHorizontalOverflow(page)).toBe(false);
    await expect(dashboard.heading).toBeVisible();
  });
});
