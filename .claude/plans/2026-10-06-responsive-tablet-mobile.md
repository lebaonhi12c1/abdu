# Plan: Responsive cho tablet và mobile

- **Ngày tạo:** 2026-10-06
- **Trạng thái:** Hoàn thành (chờ người dùng duyệt screenshot và thử trên máy thật)
- **Yêu cầu gốc:** thêm responsive cho bản table và mobile
- **Ước lượng:** M

## Tóm tắt
Làm scene 2560×1440 dùng được trên mobile và tablet. Mobile dọc thì kéo ngang (pan), còn tablet và màn ngang thì scene vừa trọn màn hình 16:9. Trên màn cảm ứng, các phần tử chỉ hiện khi hover sẽ luôn hiện mờ. Cỡ chữ và vùng chạm co giãn theo scene. Ảnh nền được tối ưu từ PNG 4.4MB sang AVIF/WebP có srcset. Giao diện desktop từ 1280px trở lên giữ nguyên.

## Quyết định đã xác nhận
| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | Mobile dọc hiển thị thế nào | Pan ngang: scene cao 100dvh, rộng 100dvh×16/9, có scroll-snap và gợi ý "kéo để xem" |
| 2 | Tablet và điện thoại xoay ngang | Contain 16:9: vừa trọn màn hình, căn giữa, phần dư là gradient |
| 3 | Hover trên màn cảm ứng | Luôn hiện mờ (khoảng 60%) trên `(hover: none)`. Đĩa đang phát hiện 100% |
| 4 | Tối ưu ảnh nền | Làm trong task này |
| 5 | Nút volume trên touch | Giữ lại, nới vùng chạm trong suốt tới ≥ 44×44px (trên iOS nút không có tác dụng, chấp nhận) |
| 6 | Tiêu chí chuyển sang pan | Theo tỉ lệ khung: `orientation: portrait` và rộng < 768px thì pan, còn lại contain |
| 7 | Có thiết kế Figma không | Không. Tự làm rồi gửi screenshot từng thiết bị để duyệt |

## Phạm vi ảnh hưởng
- `src/App.jsx`: container `h-screen` đổi thành `h-dvh`. Wrapper scene thêm `aspect-[16/9]`, `@container`, chế độ contain hoặc pan. Ảnh nền đổi sang `<picture>` và thêm `data-testid`. Label "non-interactive" và "SOCIAL" (`text-[14px]`) co giãn theo scene.
- `src/index.css`: rule `* { xl:text-base lg:text-sm md:text-[8px] text-[4px] }` thay bằng cỡ chữ theo `cqw` có kẹp min/max.
- `src/components/ImageFrame.jsx`: label hiện mờ trên touch, thêm `alt`.
- `src/components/Disc.jsx`: hiện mờ trên touch.
- `src/components/Volume.jsx`: hiện mờ trên touch, nới vùng chạm.
- `src/components/MusicPlayer.jsx`: popup volume chuyển từ inline style sang class co giãn.
- `src/assets/`: thêm ảnh nền AVIF/WebP nhiều kích thước. PNG gốc được giữ làm nguồn.
- `scripts/optimize-images.mjs` (mới) và `package.json`: thêm devDependency `sharp`.
- `playwright.config.js`, `e2e/`, `.github/workflows/test-and-lint.yml`: thêm thiết bị mobile/tablet và WebKit.
- `CLAUDE.md`: cập nhật quy ước định vị, chữ và touch.

## 1. Công việc chính
- [x] Đo baseline trước khi sửa: chụp screenshot hiện trạng ở 390×844, 820×1180, 1180×820, 844×390, 1920×1080 và chạy Lighthouse mobile (xem mục 3)
- [x] `src/App.jsx`: đổi `h-screen` thành `h-dvh`, thêm `overflow` phù hợp cho từng chế độ → `h-screen supports-[height:100dvh]:h-dvh`
- [x] `src/App.jsx`: wrapper scene thêm `relative aspect-[16/9] @container` (contain chỉ áp dụng cho thiết bị cảm ứng qua variant `fit`. Desktop giữ hành vi cũ: fill chiều ngang)
  - contain: `w-[min(100vw,calc(100dvh*16/9))]`, căn giữa
  - pan (`portrait` và < 768px): `h-dvh w-auto`, cho container ngoài `overflow-x-auto overscroll-x-contain snap-x`
- [x] `src/index.css`: thêm custom variant `touch` (`@media (hover: none)`) và `pan` (`@media (orientation: portrait) and (max-width: 767px)`) cho Tailwind v4, thêm variant `fit` (`hover: none` và (landscape hoặc ≥ 768px))
- [x] `src/App.jsx`: thêm các điểm snap (posts, screen, đĩa) và gợi ý "← kéo để xem →" chỉ hiện ở chế độ pan, tự ẩn sau lần cuộn đầu tiên (chữ gợi ý dùng tiếng Anh "← swipe to explore →" cho khớp với trang. Ẩn khi chạm hoặc sau 4s)
- [x] `src/App.jsx`: khi vào trang ở chế độ pan, tự cuộn tới vùng trung tâm (Screen) để người dùng thấy ngay phần chính
- [x] `src/index.css`: thay rule `*` cỡ chữ bằng `clamp(11px, 1.25cqw, 16px)` gắn trên wrapper scene (chiều rộng ≥ 1280 vẫn 16px như cũ) → `body *` trong `@layer base` (rule cũ nằm ngoài layer nên đè cả class `text-*`)
- [x] `src/App.jsx`: label "SOCIAL" bỏ `text-[14px]`, dùng cỡ chữ theo `cqw` (bỏ hẳn: `text-[14px]` trước giờ chưa bao giờ có tác dụng vì bị rule `*` đè, desktop vẫn 16px)
- [x] `src/components/Disc.jsx`: thêm `touch:opacity-60`, giữ `opacity-100` khi đang phát, tên bài xuống dòng trong phạm vi đĩa trên touch để không chồng nhau
- [x] `src/components/ImageFrame.jsx`: label thêm `touch:opacity-100` (nền mờ như hiện tại) và `alt` cho ảnh (dùng `touch:opacity-80`)
- [x] `src/App.jsx`: label "non-interactive" thêm `touch:opacity-60`
- [x] `src/components/Volume.jsx`: thêm `touch:opacity-60`, thêm pseudo-element trong suốt `before:absolute before:-inset-[Xpx]` để vùng chạm ≥ 44×44px. Label volume hiện trên touch → ⚠️ đã đổi: label volume KHÔNG hiện trên touch vì chồng lên nhãn SOCIAL ở tablet. Vùng chạm mở rộng ra phía ngoài từng nút (`classNameHitArea`) để 2 nút không đè nhau
- [x] `src/components/MusicPlayer.jsx`: popup volume chuyển inline style sang class Tailwind, cỡ chữ và padding co giãn (`clamp`)
- [x] `scripts/optimize-images.mjs`: dùng `sharp` sinh `pull` và `pull2` ở dạng AVIF + WebP, kích thước 1280/1920/2560. Thêm script `npm run optimize:images`. Kết quả: 2560 AVIF 199KB / WebP 382KB, 1280 AVIF 77KB / WebP 145KB
- [x] `src/App.jsx`: ảnh nền dùng `<picture>` + `srcset` + `sizes`, thêm `width="2560" height="1440"`, `fetchpriority="high"` cho ảnh chính, `decoding="async"`, `data-testid="bg"` (srcset tạo trong `src/assets/bg/index.js`)
- [x] `src/App.jsx`: prefetch `pull2` sau sự kiện `load` để không bị nháy khi bấm Screen (render ẩn sau `onLoad` của ảnh chính, `fetchPriority="low"`)
- [x] Đổi tên `low-quality-pull.png` thành `.jpg` vì file thực chất là JPEG
- [x] Gửi screenshot 5 viewport (dùng Playwright MCP) cho người dùng duyệt trước khi tinh chỉnh (chụp bằng script Playwright thay vì Playwright MCP để chạy được cả WebKit. Thêm 2 ảnh pan iPhone ở mép trái và mép phải)
- [x] `CLAUDE.md`: cập nhật mục Positioning convention (chế độ contain/pan, chữ theo `cqw`, variant `touch`/`pan`, ảnh qua `npm run optimize:images`), và mục Commands/Architecture

## 2. Test
- [x] Cập nhật hoặc thêm test Playwright trong `e2e/` (unit test Vitest chỉ thêm khi cần): `e2e/responsive.spec.js` (mới, 9 test) và `e2e/home.spec.js`
- [x] Không áp dụng (unit/component test): thay đổi chỉ là layout và CSS, Playwright E2E đã bao quát
- [x] `playwright.config.js`: thêm project `iPhone 13` (WebKit), `Pixel 7`, `iPad (gen 7)` dọc và `iPad (gen 7) landscape` (`home.spec.js` chạy trên desktop, `responsive.spec.js` chạy trên 4 thiết bị)
- [x] `.github/workflows/test-and-lint.yml`: cài `chromium webkit`
- [x] Sửa test cũ: selector ảnh nền đổi sang `getByTestId("bg")`. Test `naturalWidth` đổi thành kiểm tra tỉ lệ 16:9 và `currentSrc` là avif/webp, thêm test desktop giữ nguyên (scene full chiều ngang, chữ 16px, không hiện gợi ý pan)
- [x] E2E chế độ pan (390×844): scene cao bằng viewport, `scrollWidth > clientWidth`, không có cuộn dọc. Gợi ý "kéo để xem" hiện (iPhone 13 và Pixel 7). Thêm test kéo về hai mép không bị snap ngược về Screen (lỗi WebKit đã sửa)
- [x] E2E chế độ contain (820×1180, 1180×820, 844×390): scene nằm trọn trong viewport, tỉ lệ 16:9 (sai số < 1%), không cuộn (iPad dọc và ngang, và các thiết bị sau khi xoay). Kiểm tra "cuộn được thật" phải xét cả `overflow`, vì tên bài lấn 1px nhưng `overflow: hidden`
- [x] E2E touch: `tap()` lên Screen bật/tắt "Preparing Access...". Trên `hover: none` thì đĩa, nút volume và label có `opacity > 0`. Nhãn volume kiểm tra là ẩn (opacity 0)
- [x] E2E vùng chạm: phone, mỗi đĩa và mỗi nút volume có boundingBox (tính cả vùng chạm mở rộng) ≥ 44×44px ở chế độ pan (phone và đĩa: boundingBox ≥ 44px ở pan, ≥ 24px ở fit. Volume: `elementFromPoint` ở 4 điểm cách tâm ±20px trúng nút, tức vùng chạm khoảng 40px trở lên, không đo đúng 44px)
- [x] E2E cỡ chữ: label đĩa và "SOCIAL" có `font-size` ≥ 11px ở mọi viewport. Ở 1920 bằng 16px (giống trước)
- [x] E2E xoay màn hình: đổi từ 390×844 sang 844×390 thì chuyển từ pan sang contain
- [ ] Kiểm tra responsive: phần tử mới/đã sửa có test vị trí % ở 1280, 1920 và 2560px (xem `e2e/home.spec.js`), mở rộng thêm cho 390 và 820 ⚠️ chưa thêm test vị trí % riêng ở 390/820. Toạ độ % trong scene không đổi (scene vẫn 16:9), đã đối chiếu bằng screenshot và test vùng chạm. Test vị trí 1280/1920/2560 trên desktop vẫn pass
- [x] E2E: chạy `npm run test:e2e` và pass trên tất cả project: local chạy 2 lần 82 passed / 8 skipped, CI mode (`CI=1`, build + preview) 41 passed / 4 skipped. Skip = test chỉ dành cho pan khi chạy trên iPad
- [x] `npm run lint` pass
- [x] `npm run build` pass

## 3. Performance
- [x] Đo baseline trước khi sửa: trace chrome-devtools MCP, rồi chuyển sang `scripts/measure-perf.mjs` (Playwright, cold cache, Slow 4G, CPU 4x, chặn YouTube) vì DevTools dính cache và LCP chỉ đo placeholder. Baseline mobile: LCP 2152ms (placeholder), ảnh nền nét tải xong 27749ms, tổng 5478KB, CLS 0
- [x] Ảnh nền AVIF/WebP. Tiêu chí: mỗi biến thể 2560 ≤ 500KB, biến thể 1280 ≤ 200KB (so dung lượng trong `dist/assets` sau build): 2560 AVIF 199KB / WebP 382KB, 1280 AVIF 77KB / WebP 145KB
- [x] `width`/`height` + `aspect-[16/9]`. Tiêu chí: CLS < 0.1: CLS mobile 0, tablet 0.002, desktop 0
- [x] Đo lại sau khi sửa. Tiêu chí đạt: LCP Lighthouse mobile < 2.5s, hoặc giảm ≥ 50% so với baseline nếu baseline quá cao vì tải iframe YouTube. Tổng byte tải trang đầu giảm ≥ 70%. Bundle JS không tăng quá 5KB gzip: mobile LCP 1088ms (✓ < 2.5s, nhưng phần tử LCP lúc này là chữ gợi ý pan), ảnh nền nét tải xong 27.7s → 6.3s (-77%), tổng byte 5478KB → 1385KB (-75% ✓), JS +1.65KB gzip ✓

## 4. Bảo mật
- [x] `npm audit` không có lỗ hổng high/critical mới sau khi thêm `sharp` (chỉ là devDependency): 9 lỗ hổng (7 high) giống hệt HEAD, đều có sẵn từ trước (vite, postcss, nanoid...), không có cái mới
- [x] Link ngoài có `rel="noopener noreferrer"`. Đã có test, phải vẫn pass
- [x] Không có secret trong code hay biến `VITE_*`
- [x] Không áp dụng (header bảo mật/CSP trong `nginx.conf`): không thêm nguồn bên thứ ba mới. Việc bổ sung CSP để làm sau
- [x] Không áp dụng (rủi ro riêng): thay đổi chỉ là layout, CSS và ảnh tĩnh

## 5. Scale up
- [x] Cache header nginx đúng cho asset mới (asset có hash thì immutable). Kiểm tra file `.avif`/`.webp` trong `dist` có hash và khớp rule `\.[0-9a-f]+\.` → ⚠️ phát hiện lỗi có sẵn: regex hash `.[0-9a-f]+.` không khớp hash base64 của Vite, và rule 7 ngày thiếu avif/webp nên AVIF không được cache. Đã sửa `nginx.conf` thành `location ^~ /assets/` (1 năm, immutable), kiểm tra bằng curl trên container
- [ ] Kích thước Docker image / thời gian build CI không tăng bất thường. Tiêu chí: `dist/` không lớn hơn trước (PNG 4.4MB không còn bị bundle). Thời gian job CI tăng không quá 3 phút do thêm WebKit ⚠️ `dist/` 10MB → 3.6MB ✓. `docker build` 33s, image 66.6MB ✓. Chưa đo thời gian job CI vì chưa push
- [x] App vẫn stateless, chạy được nhiều replica sau load balancer / CDN
- [x] `sharp` chỉ chạy trong script tạo ảnh và ảnh sinh ra được commit, nên build Docker (alpine) không cần `sharp` (sharp vẫn được cài như devDependency trong Docker, build vẫn OK)

## 6. MCP
- [x] Đã kiểm tra MCP hiện có (`claude mcp list`, `.mcp.json`): có `playwright` và `chrome-devtools`, cả hai đang chờ approve
- [x] Không cần thêm: không có Figma. Dùng Playwright MCP để chụp screenshot và chrome-devtools MCP để chạy Lighthouse
- [x] Approve 2 MCP server (người dùng khởi động lại Claude Code, kiểm tra bằng `/mcp`) trước khi đo baseline

## Rủi ro
- Chạm volume trên iOS không có tác dụng (`setVolume` bị chặn): đã chấp nhận theo quyết định 5. Ghi chú trong code
- Sửa rule `*` cỡ chữ làm desktop thay đổi: so screenshot 1280/1920/2560 trước và sau, test cỡ chữ ở 1920 bằng 16px
- Pan ngang xung đột với cử chỉ back/forward của Safari: dùng `overscroll-behavior-x: contain`, kiểm tra trên WebKit (Playwright) và nhắc người dùng thử trên máy thật
- `100dvh` trên trình duyệt cũ: fallback bằng `h-screen` đặt trước `h-dvh`
- Chưa có thiết kế nên kết quả có thể không đúng ý: gửi screenshot duyệt sớm (task trong mục 1)
- Đổi `<img>` sang `<picture>` làm hỏng test cũ: dùng `data-testid`, sửa test cùng lúc

## Kết quả kiểm tra
Đo bằng `npm run perf` (cold cache, Slow 4G, CPU 4x, chặn YouTube, trung vị 3 lần):

| Viewport | Ảnh nền nét tải xong | Tổng tải | LCP | CLS |
|---|---|---|---|---|
| mobile 390×844 trước | 27749ms (PNG) | 5478KB | 2152ms (placeholder) | 0 |
| mobile 390×844 sau | 6336ms (AVIF 2560) | 1385KB | 1088ms | 0 |
| tablet 820×1180 sau | 4837ms (AVIF 1920) | 1254KB | 2124ms | 0.002 |
| desktop 1920 trước | 28069ms | 5478KB | 7088ms (p4.png) | 0 |
| desktop 1920 sau | 4825ms | 1254KB | 6708ms (p4.png) | 0 |

- `npm run lint`: pass
- `npm run build`: pass, JS 249.27KB (gzip 80.28KB, +1.65KB)
- `npm run test:e2e`: 41 passed / 4 skipped (CI mode), 5 project (desktop, iPhone, Pixel, iPad, iPad landscape)
- `docker build`: OK, 33s, 66.6MB. pnpm `--frozen-lockfile` fail rồi fallback sang `npm install` (pnpm-lock chưa đồng bộ)
- `npm audit`: không có lỗ hổng mới

## Ghi chú
- Desktop LCP vẫn khoảng 6.7s do ảnh post PNG (p1–p6, đĩa, screen, phone, tổng khoảng 1MB) chưa tối ưu. Nên làm task riêng: dùng chung `optimize-images.mjs` cho các ảnh này.
- `pnpm-lock.yaml` chưa có `@playwright/test` và `sharp`. Docker vẫn build được nhờ fallback, cần người dùng chọn: bỏ pnpm-lock hoặc chạy `pnpm install`.
- 9 lỗ hổng npm có sẵn (vite, postcss...) đều có bản fix: chạy `npm audit fix` trong task riêng.
- Cần thử trên iPhone/iPad thật: cử chỉ back của Safari khi kéo ngang, và phát nhạc YouTube.
- Dependency `react-player` không được import ở đâu. Có thể gỡ trong task khác.
- `src/App.css` rỗng và không được import. Có thể xoá trong task khác.
