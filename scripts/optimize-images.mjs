// Sinh ảnh nền AVIF/WebP nhiều kích thước từ PNG gốc 2560×1440.
// Dùng: npm run optimize:images (chạy lại khi đổi pull.png / pull2.png, rồi commit ảnh trong src/assets/bg/)
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";

const SOURCES = ["pull", "pull2"];
const WIDTHS = [1280, 1920, 2560];
const FORMATS = {
    avif: (img) => img.avif({ quality: 50, effort: 6 }),
    webp: (img) => img.webp({ quality: 78, effort: 6 }),
};
const OUT = "src/assets/bg";

await mkdir(OUT, { recursive: true });
for (const name of SOURCES) {
    for (const width of WIDTHS) {
        for (const [ext, encode] of Object.entries(FORMATS)) {
            const file = `${OUT}/${name}-${width}.${ext}`;
            await encode(sharp(`src/assets/${name}.png`).resize({ width })).toFile(file);
            const { size } = await stat(file);
            console.log(`${file.padEnd(32)} ${Math.round(size / 1024)} KB`);
        }
    }
}
