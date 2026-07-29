import { test, expect } from "../fixtures";

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
