// Đo hiệu năng tải trang (cold cache) trên mobile giả lập: Slow 4G + CPU 4x.
// Dùng: npm run build && npm run preview -- --port 4173, rồi `node scripts/measure-perf.mjs [url]`
// YouTube bị chặn để kết quả chỉ phản ánh tài nguyên của dự án.
import { chromium } from "@playwright/test";

const url = process.argv[2] ?? "http://localhost:4173/";
const RUNS = 3;

const viewports = [
    { name: "mobile 390x844", width: 390, height: 844, dpr: 3, mobile: true },
    { name: "tablet 820x1180", width: 820, height: 1180, dpr: 2, mobile: true },
    { name: "desktop 1920x1080", width: 1920, height: 1080, dpr: 1, mobile: false },
];

async function measure(browser, vp) {
    const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
    });
    const page = await context.newPage();
    await page.route(/youtube\.com|ytimg\.com|googlevideo\.com|doubleclick\.net/, (r) => r.abort());

    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    // Thông số "Slow 4G" của Chrome DevTools
    await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    let bytes = 0;
    cdp.on("Network.loadingFinished", (e) => (bytes += e.encodedDataLength));

    await page.goto(url, { waitUntil: "load", timeout: 300_000 });
    // Ảnh được React chèn sau khi JS chạy, nên phải chờ tất cả ảnh tải xong
    await page.waitForFunction(
        () => document.images.length > 0 && [...document.images].every((i) => i.complete),
        null,
        { timeout: 300_000, polling: 250 },
    );

    const result = await page.evaluate(async () => {
        const lcp = await new Promise((res) =>
            new PerformanceObserver((l) => res(l.getEntries().at(-1))).observe({
                type: "largest-contentful-paint",
                buffered: true,
            }),
        );
        const cls = await new Promise((res) => {
            let v = 0;
            new PerformanceObserver((l) => {
                for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value;
            }).observe({ type: "layout-shift", buffered: true });
            setTimeout(() => res(v), 100);
        });
        // Ảnh nền chất lượng cao: ảnh có tên "pull" (không phải placeholder) lớn nhất
        const bg = performance
            .getEntriesByType("resource")
            .filter((r) => /\/pull[-.]/.test(r.name))
            .sort((a, b) => a.responseEnd - b.responseEnd)[0];
        return {
            lcpMs: Math.round(lcp.startTime),
            lcpFile: (lcp.url || lcp.element?.tagName || "").split("/").pop(),
            bgLoadedMs: bg ? Math.round(bg.responseEnd) : null,
            bgFile: bg?.name.split("/").pop() ?? null,
            allImagesMs: Math.round(
                Math.max(
                    ...performance
                        .getEntriesByType("resource")
                        .filter((r) => r.initiatorType === "img")
                        .map((r) => r.responseEnd),
                ),
            ),
            cls: Math.round(cls * 1000) / 1000,
        };
    });
    await context.close();
    return { ...result, totalKB: Math.round(bytes / 1024) };
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const browser = await chromium.launch();
for (const vp of viewports) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, vp));
    const pick = (k) => median(runs.map((r) => r[k]));
    console.log(
        JSON.stringify({
            viewport: vp.name,
            lcpMs: pick("lcpMs"),
            lcpFile: runs[0].lcpFile,
            bgLoadedMs: pick("bgLoadedMs"),
            bgFile: runs[0].bgFile,
            allImagesMs: pick("allImagesMs"),
            totalKB: pick("totalKB"),
            cls: pick("cls"),
        }),
    );
}
await browser.close();
