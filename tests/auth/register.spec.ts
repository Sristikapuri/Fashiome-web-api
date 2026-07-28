import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { buildRegisterPayload } from "../test-data/users";

test.describe("Registration", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("registers a new account and redirects to login", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const payload = buildRegisterPayload();

    await registerPage.goto();
    await registerPage.register(payload);

    await expect(registerPage.successPanel).toContainText(/account created successfully/i);
    await page.waitForURL("**/login", { timeout: 6_000 });

    const loginPage = new LoginPage(page);
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");
  });

  test("blocks submission until Terms are accepted", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const payload = buildRegisterPayload();

    await registerPage.goto();
    await registerPage.fill(payload);
    await registerPage.submit();

    await expect(registerPage.errorAlert).toContainText(/accept the terms/i);
    await expect(page).toHaveURL(/\/register$/);
  });

  test("rejects a duplicate email on second registration", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const payload = buildRegisterPayload();

    await registerPage.goto();
    await registerPage.register(payload);
    await expect(registerPage.successPanel).toContainText(/account created successfully/i);

    await registerPage.goto();
    await registerPage.register(buildRegisterPayload({ email: payload.email }));

    await expect(registerPage.errorAlert).toBeVisible();
  });

  test.describe("client-side validation", () => {
    test("flags invalid email format", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.fill(buildRegisterPayload({ email: "not-an-email" }));
      await registerPage.submit();

      await expect(page.getByText(/invalid email address/i)).toBeVisible();
    });

    test("flags a too-short password", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.fill(buildRegisterPayload({ password: "123", confirmPassword: "123" }));
      await registerPage.submit();

      await expect(page.getByText(/password must be at least 6 characters/i)).toBeVisible();
    });

    test("flags mismatched confirm password", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.fill(
        buildRegisterPayload({ password: "Passw0rd!", confirmPassword: "Different1!" })
      );
      await registerPage.submit();

      await expect(page.getByText(/passwords do not match/i)).toBeVisible();
    });

    test("flags a too-short username", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.fill(buildRegisterPayload({ username: "ab" }));
      await registerPage.submit();

      await expect(page.getByText(/username must be at least 3 characters/i)).toBeVisible();
    });

    test("flags an out-of-range age", async ({ page }) => {
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.fill(buildRegisterPayload({ age: "150" }));
      await registerPage.submit();

      await expect(page.getByText(/age must be between 1 and 100/i)).toBeVisible();
    });
  });
});
