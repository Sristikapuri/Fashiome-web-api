import path from "node:path";
import { test, expect } from "../fixtures";


test.describe("Profile - View Profile", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });

  test("should navigate to the profile update page", async ({ page }) => {
    await page.goto("/dashboard?tab=profile");

    await page.getByRole("button", { name: "Edit Profile" }).click();

    await page.waitForURL("**/dashboard/profile**");
    await expect(page.getByRole("heading", { level: 1, name: "Update Profile" })).toBeVisible();
  });
});
