import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ADMIN_CREDENTIALS } from "../test-data/users";
import { ROUTES } from "../test-data/routes";

test.describe("Login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("logs in with valid admin credentials and lands on the admin area", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);

    await page.waitForURL("**/dashboard/admin");
    await expect(page).toHaveURL(/\/dashboard\/admin$/);
  });

  test("rejects a valid email with the wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_CREDENTIALS.email, "definitely-wrong-password");

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("redirects unauthenticated users away from a protected route", async ({ page }) => {
    await page.goto(ROUTES.admin);
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/\/login$/);
  });
});
