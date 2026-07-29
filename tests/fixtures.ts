import { test as base, expect } from "@playwright/test";
import { addCoverageReport } from "monocart-reporter";


export const test = base.extend({
  page: async ({ page }, runTest, testInfo) => {
    const coverageEnabled = !!process.env.COVERAGE;

    if (coverageEnabled) {
      await Promise.all([
        page.coverage.startJSCoverage({ resetOnNavigation: false }),
        page.coverage.startCSSCoverage({ resetOnNavigation: false }),
      ]);
    }

    await runTest(page);

    if (coverageEnabled) {
      const [jsCoverage, cssCoverage] = await Promise.all([
        page.coverage.stopJSCoverage(),
        page.coverage.stopCSSCoverage(),
      ]);
      await addCoverageReport([...jsCoverage, ...cssCoverage], testInfo);
    }
  },
});

export { expect };
