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
    // RegisterForm.tsx redirects to /login (via a 3s setTimeout) now that
    // the onboarding carousel has been removed.
    await page.waitForURL("**/login", { timeout: 8_000 });

    const loginPage = new LoginPage(page);
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");
  });
});
