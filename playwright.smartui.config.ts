import { defineConfig } from "@playwright/test";

// Visual test for SmartUI: one desktop browser against the production build.
// Run with `npm run test:visual` (needs PROJECT_TOKEN set in your shell).
export default defineConfig({
  testDir: "./smartui",
  reporter: "list",
  use: { baseURL: "http://localhost:3100", channel: "chrome", viewport: { width: 1280, height: 800 } },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
