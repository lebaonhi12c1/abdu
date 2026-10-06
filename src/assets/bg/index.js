// Ảnh nền sinh bởi `npm run optimize:images` (scripts/optimize-images.mjs)
const files = import.meta.glob("./*.{avif,webp}", {
    eager: true,
    query: "?url",
    import: "default",
});

// "url 1280w, url 1920w, ..." cho một ảnh và một định dạng
const srcSet = (name, ext) =>
    Object.entries(files)
        .map(([path, url]) => [path.match(/^\.\/(.+)-(\d+)\.(\w+)$/), url])
        .filter(([m]) => m[1] === name && m[3] === ext)
        .sort(([a], [b]) => a[2] - b[2])
        .map(([m, url]) => `${url} ${m[2]}w`)
        .join(", ");

const background = (name) => ({
    avif: srcSet(name, "avif"),
    webp: srcSet(name, "webp"),
    fallback: files[`./${name}-2560.webp`],
});

export const pull = background("pull");
export const pull2 = background("pull2");

// Chế độ pan (mobile dọc): scene cao bằng màn hình, rộng = 16/9 chiều cao
export const sizes =
    "(orientation: portrait) and (max-width: 767px) calc(100vh * 16 / 9), 100vw";
