import path from "node:path";
import { test, expect } from "../fixtures";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { ROUTES } from "../test-data/routes";

test.describe("Admin dashboard", () => {
  test.use({ storageState: path.resolve(__dirname, "../../playwright/.auth/admin.json") });

  test("loads the overview with live stats", async ({ page }) => {
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.heading).toBeVisible();
    await expect(page.getByText(/active user records/i)).toBeVisible();
  });

  test("navigates between admin sections via the sidebar", async ({ page }) => {
    const dashboard = new AdminDashboardPage(page);
    await dashboard.goto();

    await dashboard.usersLink.click();
    await page.waitForURL("**/dashboard/admin/users");
    await expect(page.getByRole("heading", { name: /user management/i })).toBeVisible();

    await dashboard.clothesLink.click();
    await page.waitForURL("**/dashboard/admin/clothes");
    await expect(page.getByRole("heading", { name: /clothes management/i })).toBeVisible();

    await dashboard.overviewLink.click();
    await page.waitForURL(new RegExp(`${ROUTES.admin}$`));
    await expect(dashboard.heading).toBeVisible();

    await dashboard.backToDashboardLink.click();
    await page.waitForURL(new RegExp(`${ROUTES.dashboard}$`));
  });

  test("every admin route requires authentication", async ({ browser }) => {
   
    const anonymousContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const anonymousPage = await anonymousContext.newPage();

    for (const route of [ROUTES.admin, ROUTES.adminUsers, ROUTES.adminClothes, ROUTES.adminOrders]) {
      await anonymousPage.goto(route);
      await anonymousPage.waitForURL("**/login");
      await expect(anonymousPage).toHaveURL(/\/login$/);
    }

    await anonymousContext.close();
  });
});
