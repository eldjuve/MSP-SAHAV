import { defineConfig, devices } from '@playwright/test';

// Standalone from vitest.config.ts, same as that file is from vite.config.ts:
// these are real-browser end-to-end tests, driving the actual dev server
// rather than importing modules directly. `webServer` starts `npm run dev`
// itself, so `npx playwright test` works standalone without a server
// already running.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
