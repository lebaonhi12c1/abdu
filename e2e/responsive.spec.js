import { test, expect } from "@playwright/test";

// Chạy trên các project thiết bị cảm ứng (iphone, pixel, ipad, ipad-landscape) trong playwright.config.js
// Mobile dọc < 768px: chế độ "pan" (kéo ngang). Còn lại: chế độ "fit" (scene 16:9 vừa trọn màn hình).
const modeOf = ({ width, height }) =>
    height > width && width < 768 ? "pan" : "fit";

test.beforeEach(async ({ page }) => {
    await page.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (route) =>
        route.abort(),
    );
    await page.goto("/");
    await expect(page.getByTestId("bg")).toBeVisible();
});

const sceneMetrics = (page) =>
    page.evaluate(() => {
        const scene = document.querySelector("[data-testid=scene]").getBoundingClientRect();
        const main = document.querySelector("main");
        return {
            scene: { x: scene.x, y: scene.y, w: scene.width, h: scene.height },
            vw: window.innerWidth,
            vh: window.innerHeight,
            // Cuộn được thật: overflow cho phép cuộn và nội dung rộng hơn khung
            scrollsX:
                ["auto", "scroll"].includes(getComputedStyle(main).overflowX) &&
                main.scrollWidth > main.clientWidth,
            pageScrollsY: document.documentElement.scrollHeight > window.innerHeight + 1,
        };
    });

const expectLayout = async (page, mode) => {
    const m = await sceneMetrics(page);
    expect(m.scene.w / m.scene.h).toBeCloseTo(16 / 9, 1);
    expect(m.pageScrollsY).toBe(false);
    if (mode === "pan") {
        expect(Math.abs(m.scene.h - m.vh)).toBeLessThanOrEqual(1);
        expect(m.scrollsX).toBe(true);
    } else {
        expect(m.scrollsX).toBe(false);
        expect(m.scene.x).toBeGreaterThanOrEqual(-1);
        expect(m.scene.y).toBeGreaterThanOrEqual(-1);
        expect(m.scene.x + m.scene.w).toBeLessThanOrEqual(m.vw + 1);
        expect(m.scene.y + m.scene.h).toBeLessThanOrEqual(m.vh + 1);
        // Chạm ít nhất một cạnh màn hình (contain)
        expect(
            Math.min(m.vw - m.scene.w, m.vh - m.scene.h),
        ).toBeLessThanOrEqual(1);
    }
};

test("bố cục đúng chế độ pan/fit", async ({ page }) => {
    await expectLayout(page, modeOf(page.viewportSize()));
});

test("ảnh nền dùng AVIF/WebP", async ({ page }) => {
    const src = await page.getByTestId("bg").evaluate((img) => img.currentSrc);
    expect(src).toMatch(/\.(avif|webp)$/);
});

test("pan: mở trang ở khu vực Screen và có gợi ý kéo", async ({ page }) => {
    test.skip(modeOf(page.viewportSize()) !== "pan", "chỉ áp dụng mobile dọc");
    const box = await page.getByAltText("Screen").boundingBox();
    const centerX = box.x + box.width / 2;
    expect(centerX).toBeGreaterThan(0);
    expect(centerX).toBeLessThan(page.viewportSize().width);
    await expect(page.getByText("swipe to explore")).toBeVisible();
});

test("pan: kéo về hai mép scene thì giữ nguyên, không bị snap về Screen", async ({ page }) => {
    test.skip(modeOf(page.viewportSize()) !== "pan", "chỉ áp dụng mobile dọc");
    const main = page.locator("main");
    await main.evaluate((el) => (el.scrollLeft = 0));
    // Qua mốc 4s gợi ý tự ẩn (re-render) — trước đây WebKit re-snap về Screen ở đây
    await page.waitForTimeout(4500);
    expect(await main.evaluate((el) => el.scrollLeft)).toBe(0);

    await main.evaluate((el) => (el.scrollLeft = el.scrollWidth));
    await page.waitForTimeout(300);
    const atEnd = await main.evaluate(
        (el) => el.scrollWidth - el.clientWidth - el.scrollLeft,
    );
    expect(atEnd).toBeLessThanOrEqual(1);
});

test("touch: các phần tử vốn chỉ hiện khi hover được hiện sẵn", async ({ page }) => {
    const opacity = (locator) =>
        locator.evaluate((el) => Number(getComputedStyle(el).opacity));

    for (const disc of await page.getByAltText("Disc").all()) {
        expect(await opacity(disc.locator(".."))).toBeGreaterThan(0);
    }
    for (const vol of await page.getByAltText("Volume").all()) {
        expect(await opacity(vol.locator(".."))).toBeGreaterThan(0);
    }
    expect(await opacity(page.getByText("SOCIAL"))).toBeGreaterThan(0);
    expect(await opacity(page.getByText("non-interactive"))).toBeGreaterThan(0);
    // Nhãn volume cố ý ẩn trên touch vì chồng lên nhãn SOCIAL
    expect(await opacity(page.getByText("volume +"))).toBe(0);
});

test("touch: tap Screen bật/tắt Preparing Access", async ({ page }) => {
    const screen = page.getByAltText("Screen").locator("..");
    await expect(screen).toHaveClass(/opacity-0/);
    await screen.tap();
    await expect(screen).toHaveClass(/opacity-100/);
    await screen.tap();
    await expect(screen).toHaveClass(/opacity-0/);
});

test("vùng chạm đủ lớn", async ({ page }) => {
    const mode = modeOf(page.viewportSize());
    // pan: chuẩn Apple 44px. fit: tối thiểu WCAG 2.5.8 là 24px
    const min = mode === "pan" ? 44 : 24;
    const targets = [
        page.locator("a[href='https://link.me/rozikcrypto']"),
        ...(await page.getByAltText("Disc").all()).map((d) => d.locator("..")),
    ];
    for (const t of targets) {
        await t.scrollIntoViewIfNeeded();
        const box = await t.boundingBox();
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(min);
    }

    // Nút volume rất nhỏ, vùng chạm được nới bằng ::before. Kiểm tra bằng elementFromPoint
    // ở 4 điểm cách tâm nút ±20px (tương đương vùng 40px+)
    for (const [label, outward] of [["volume -", -1], ["volume +", 1]]) {
        const button = page.getByText(label).locator("..");
        await button.scrollIntoViewIfNeeded();
        const hits = await button.evaluate((el, dir) => {
            const r = el.getBoundingClientRect();
            const cx = r.x + r.width / 2;
            const cy = r.y + r.height / 2;
            const points = [
                [cx, cy - 20],
                [cx, cy + 20],
                [cx + dir * 20, cy],
                [cx + dir * 20, cy - 15],
            ];
            return points.map(([x, y]) => el.contains(document.elementFromPoint(x, y)));
        }, outward);
        expect(hits).toEqual([true, true, true, true]);
    }
});

test("cỡ chữ đọc được (≥ 11px)", async ({ page }) => {
    const sizes = await page.evaluate(() =>
        ["\"Pyar\"", "SOCIAL", "non-interactive", "View"].map((text) => {
            const el = [...document.querySelectorAll("div, span")].find(
                (e) => e.childElementCount === 0 && e.textContent.trim() === text,
            );
            return parseFloat(getComputedStyle(el).fontSize);
        }),
    );
    for (const s of sizes) expect(s).toBeGreaterThanOrEqual(11);
});

test("xoay màn hình đổi chế độ bố cục", async ({ page }) => {
    const { width, height } = page.viewportSize();
    await page.setViewportSize({ width: height, height: width });
    await expectLayout(page, modeOf({ width: height, height: width }));
});
