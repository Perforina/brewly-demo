import { defineConfig } from "@playwright/test";

// Runs against the production build (`npm run test:e2e` builds first) using the
// locally installed Chrome, so no browser download is needed.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: { baseURL: "http://localhost:3100", channel: "chrome" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
    { name: "mobile", use: { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
