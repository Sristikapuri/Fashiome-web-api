import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ADMIN_CREDENTIALS, buildRegisterPayload } from "../test-data/users";
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

  test("rejects an unknown email with an inline error", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("nobody@fashiome-e2e.test", "whatever-password");

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("rejects a valid email with the wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_CREDENTIALS.email, "definitely-wrong-password");

    await expect(loginPage.errorAlert).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("persists the session after a page refresh", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    await page.waitForURL("**/dashboard/admin");

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard\/admin$/);
    await expect(page.getByRole("heading", { name: /style studio control room/i })).toBeVisible();
  });

  test("redirects unauthenticated users away from a protected route", async ({ page }) => {
    await page.goto(ROUTES.admin);
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("logs out and blocks re-entry to the protected area via back navigation", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    await page.waitForURL("**/dashboard/admin");

    await page.getByRole("button", { name: /logout/i }).click();
    await page.waitForURL("**/login");

    await page.goto(ROUTES.admin);
    await page.waitForURL("**/login");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("a freshly registered user logs in and lands on the regular dashboard, not admin", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const payload = buildRegisterPayload();
    await registerPage.goto();
    await registerPage.register(payload);
    await page.waitForURL("**/login");

    const loginPage = new LoginPage(page);
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);

    // Non-admin accounts must not reach the admin workspace directly.
    await page.goto(ROUTES.admin);
    await page.waitForURL("**/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
