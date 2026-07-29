import path from "node:path";
import { test, expect } from "../fixtures";



test.describe("Error Handling - Network Error", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/member.json") });

  test("should leave the discover feed stuck loading when its server action fails", async ({ page }) => {
    await page.route("**/*", async (route) => {
      const req = route.request();
      if (req.method() === "POST" && req.headers()["next-action"]) {
        await route.abort();
        return;
      }
      await route.continue();
    });

    await page.goto("/dashboard?tab=discover");

    await expect(page.getByText("Loading live outfit inspiration...")).toBeVisible();
  });
});
