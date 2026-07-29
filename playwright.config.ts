import path from "node:path";
import dotenv from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenv.config({ path: path.resolve(__dirname, "playwright.env") });

const baseURL = process.env.E2E_BASE_URL || "http://localhost:3000";
const coverageEnabled = !!process.env.COVERAGE;

export default defineConfig({
  testDir: "./tests",

  timeout: 60_000,
  expect: { timeout: 6_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  globalSetup: require.resolve("./global-setup.ts"),
  reporter: [
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["list"],
    ...(coverageEnabled
      ? ([
          [
            "monocart-reporter",
            {
              name: "FashioMe E2E Coverage Report",
              outputFile: "./coverage-reports/index.html",
              coverage: {
                reports: [["v8"], ["console-summary"], ["html"]],
                entryFilter: (entry: { url: string }) => entry.url.includes("localhost:3000"),
                sourceFilter: (sourcePath: string) =>
                  sourcePath.includes("/src/") && !sourcePath.includes("node_modules"),
              },
            },
          ],
        ] as const)
      : []),
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "responsive",
      testMatch: /ui\/responsive\.spec\.ts/,
      use: { ...devices["Pixel 7"] },
    },
  ],
});
