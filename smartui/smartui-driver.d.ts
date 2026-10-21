// The SmartUI Playwright driver ships without TypeScript types.
declare module "@lambdatest/playwright-driver" {
  import type { Page } from "@playwright/test";
  export function smartuiSnapshot(page: Page, name: string, options?: Record<string, unknown>): Promise<void>;
}
