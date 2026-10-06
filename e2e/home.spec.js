import { test, expect } from "@playwright/test";

// Chặn YouTube để test không phụ thuộc mạng bên ngoài
test.beforeEach(async ({ page }) => {
    await page.route(/youtube\.com|ytimg\.com|googlevideo\.com/, (route) =>
        route.abort(),
    );
});

test("trang load không có lỗi JS", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page).toHaveTitle("abdu");
    await expect(page.locator("#root img").first()).toBeVisible();

    expect(errors).toEqual([]);
});

test("ảnh nền AVIF/WebP 16:9, desktop 1920 tải bản ≥ 1920px", async ({ page }) => {
    await page.goto("/");
    const bg = page.getByTestId("bg");
    await expect(bg).toBeVisible();
    await expect.poll(() => bg.evaluate((img) => img.complete)).toBe(true);
    const info = await bg.evaluate((img) => ({
        src: img.currentSrc,
        w: img.naturalWidth,
        ratio: img.naturalWidth / img.naturalHeight,
    }));
    expect(info.src).toMatch(/.(avif|webp)$/);
    expect(info.w).toBeGreaterThanOrEqual(1920);
    expect(info.ratio).toBeCloseTo(16 / 9, 2);
});

test("desktop giữ nguyên: scene full chiều ngang, chữ 16px", async ({ page }) => {
    await page.goto("/");
    const scene = await page.getByTestId("scene").boundingBox();
    expect(scene.x).toBe(0);
    expect(scene.width).toBe(1920);
    const fontSize = await page
        .getByText("SOCIAL")
        .evaluate((el) => getComputedStyle(el).fontSize);
    expect(fontSize).toBe("16px");
    await expect(page.getByText("swipe to explore")).toBeHidden();
});

test("link ngoài mở tab mới và có rel noopener", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("a[href^='http']");
    await expect(links).toHaveCount(7);

    for (const link of await links.all()) {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
        await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
});

test("click màn hình bật/tắt trạng thái Preparing Access", async ({ page }) => {
    await page.goto("/");
    const screen = page.getByAltText("Screen").locator("..");

    await expect(screen).toHaveClass(/opacity-0/);
    await screen.click();
    await expect(screen).toHaveClass(/opacity-100/);
    await expect(page.getByText("Preparing Access...")).toBeVisible();
    await screen.click();
    await expect(screen).toHaveClass(/opacity-0/);
});

test("hiển thị đủ 3 đĩa nhạc", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByAltText("Disc")).toHaveCount(3);
    for (const title of ['"Pyar"', '"Love you no more"', '"Chota Bhaijaan"']) {
        await expect(page.getByText(title, { exact: true })).toBeAttached();
    }
});

// Các phần tử định vị theo % nên phải giữ nguyên vị trí tương đối với ảnh nền
for (const width of [1280, 1920, 2560]) {
    test(`vị trí tương đối giữ nguyên ở ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: Math.round((width * 9) / 16) });
        await page.goto("/");

        const bg = await page.getByTestId("scene").boundingBox();
        const phone = await page
            .locator("a[href='https://link.me/rozikcrypto']")
            .boundingBox();

        // phone: left 16.484375%, top 57.708333333%
        expect((phone.x - bg.x) / bg.width).toBeCloseTo(0.16484375, 2);
        expect((phone.y - bg.y) / bg.height).toBeCloseTo(0.57708333, 2);
    });
}
