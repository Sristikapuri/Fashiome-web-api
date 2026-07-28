import { test, expect } from "@playwright/test";
import { API_BASE_URL, authHeader, createAuthedMember } from "../utils/api-client";
import { LoginPage } from "../pages/LoginPage";


function startOfWeekIso(date: Date) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result.toISOString().slice(0, 10);
}

test.describe("AI Outfit History", () => {
  test("should load a previously saved outfit from the weekly style archive", async ({ page, request }) => {
    const { payload, token } = await createAuthedMember();
    const weekKey = startOfWeekIso(new Date());
    const archiveTitle = `E2E Archived Look ${Date.now()}`;

    const archiveResponse = await request.post(`${API_BASE_URL}/api/v1/users/style-archive`, {
      headers: authHeader(token),
      data: {
        weekKey,
        day: "Mon",
        occasion: "Party",
        title: archiveTitle,
        outfit: "Blazer and tailored trousers",
        explanation: "A saved look from a previous session.",
      },
    });
    expect(archiveResponse.status()).toBe(200);

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(payload.email, payload.password);
    await page.waitForURL("**/dashboard");

    await expect(page.getByText("Weekly Style Archive")).toBeVisible();
    await expect(page.getByText(archiveTitle)).toBeVisible();
  });
});
