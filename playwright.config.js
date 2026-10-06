import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const isCI = !!process.env.CI;

// e2e/responsive.spec.js chạy trên thiết bị cảm ứng, các spec còn lại chạy trên desktop
const RESPONSIVE = /responsive\.spec\.js/;

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
            testIgnore: RESPONSIVE,
            use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } },
        },
        { name: "iphone", testMatch: RESPONSIVE, use: { ...devices["iPhone 13"] } },
        { name: "pixel", testMatch: RESPONSIVE, use: { ...devices["Pixel 7"] } },
        { name: "ipad", testMatch: RESPONSIVE, use: { ...devices["iPad (gen 7)"] } },
        {
            name: "ipad-landscape",
            testMatch: RESPONSIVE,
            use: { ...devices["iPad (gen 7) landscape"] },
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
