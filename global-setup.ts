import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { LoginPage } from "./tests/pages/LoginPage";
import { ADMIN_CREDENTIALS, buildRegisterPayload } from "./tests/test-data/users";
import { registerUserViaApi } from "./tests/utils/api-client";

const AUTH_DIR = path.resolve(__dirname, "playwright/.auth");
const MEMBER_META_PATH = path.join(AUTH_DIR, "member.meta.json");


export default async function globalSetup() {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
  const browser = await chromium.launch();

  const adminContext = await browser.newContext({ baseURL });
  const adminPage = await adminContext.newPage();
  const adminLogin = new LoginPage(adminPage);
  await adminLogin.goto();
  await adminLogin.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  await adminPage.waitForURL("**/dashboard/admin");
  await adminContext.storageState({ path: path.join(AUTH_DIR, "admin.json") });
  await adminContext.close();

  const memberPayload = buildRegisterPayload();
  const registerResult = await registerUserViaApi(memberPayload);
  if (!registerResult.isSuccess) {
    throw new Error(
      `global-setup: failed to seed member user via API: ${registerResult.responseMessage}`
    );
  }

  const memberContext = await browser.newContext({ baseURL });
  const memberPage = await memberContext.newPage();
  const memberLogin = new LoginPage(memberPage);
  await memberLogin.goto();
  await memberLogin.login(memberPayload.email, memberPayload.password);
  await memberPage.waitForURL("**/dashboard");
  await memberContext.storageState({ path: path.join(AUTH_DIR, "member.json") });
  await memberContext.close();

  fs.writeFileSync(MEMBER_META_PATH, JSON.stringify(memberPayload, null, 2));

  await browser.close();
}
