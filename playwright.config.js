import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const isCI = !!process.env.CI;

// https://playwright.dev/docs/test-configuration
export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,
    reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
        },
    ],
    // CI chạy trên bản build production, local dùng dev server cho nhanh
    webServer: {
        command: isCI
            ? `npm run build && npm run preview -- --port ${PORT} --strictPort`
            : `npm run dev -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !isCI,
        timeout: 120_000,
    },
});
