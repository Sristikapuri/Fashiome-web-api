import path from "node:path";
import { test, expect } from "@playwright/test";


test.describe("Profile - Style Profile Link", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });

  test("should navigate to the silhouette page from Edit Style Profile", async ({ page }) => {
    await page.goto("/dashboard?tab=profile");

    await page.getByRole("button", { name: "Edit Style Profile" }).click();

    await page.waitForURL("**/silhouette");
    await expect(page).toHaveURL(/\/silhouette$/);
  });
});
