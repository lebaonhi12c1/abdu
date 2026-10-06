# CLAUDE.md

Single-page interactive landing page (React 19 + Vite 8 + Tailwind CSS v4), JavaScript only (no TypeScript). Served as static files by nginx in Docker.

## Commands

- `npm run dev`: Vite dev server
- `npm run lint`: ESLint (flat config, `eslint.config.js`)
- `npm run build`: production build to `dist/`
- `docker compose up --build`: build and serve via nginx

- `npm run test:e2e`: Playwright E2E tests in `e2e/`. `home.spec.js` runs on desktop Chromium. `responsive.spec.js` runs on iPhone 13 and iPad (WebKit) and Pixel 7, see the `projects` in `playwright.config.js`. Locally they start the dev server on :4173. With `CI=1` they run `build` + `preview`. YouTube requests are blocked inside the tests.
- `npm run test:e2e:ui` / `npm run test:e2e:report`: interactive UI mode / last HTML report

CI (`.github/workflows/test-and-lint.yml`) runs `npm install`, then lint, build and E2E on Node 25. Run lint, build and `test:e2e` before you call a change done. There are no unit tests. Use Playwright for UI behavior and for checking % positions at several viewport widths (see `e2e/home.spec.js`).

Both `package-lock.json` and `pnpm-lock.yaml` exist. CI uses npm, and the Dockerfile tries pnpm first. Use npm unless told otherwise, and keep both lockfiles in sync when you change dependencies.

## Architecture

- `src/App.jsx`: the whole scene. A 2560×1440 background image (AVIF/WebP from `src/assets/bg/`, with `low-quality-pull.jpg` as a placeholder underneath) and absolutely positioned interactive elements on top of it.
- `src/components/ImageFrame.jsx`: a clickable image that links out (opens in a new tab) and shows a hover label.
- `src/components/MusicPlayer.jsx`: three "disc" buttons that play YouTube audio through `react-youtube`, plus a volume popup (`Volume.jsx`, `Disc.jsx`).
- `src/utils/cn.js`: `cn()` = `clsx` + `tailwind-merge`. Use it to combine class names.

### Positioning convention

Everything on top of the background is positioned in **percentages of the 2560×1440 background**, so the layout scales with the image:
- x / left / width = `px / 2560 * 100` (e.g. `475px` → `18.5546875%`)
- y / top / height = `px / 1440 * 100` (e.g. `519px` → `36.041666666%`)

When adding or moving an element, take its pixel coordinates from the design and convert them this way. Don't use fixed px or width breakpoints for elements in the scene.

### Responsive modes (custom variants in `src/index.css`)

The scene wrapper (`data-testid="scene"` in `App.jsx`) is a 16:9 `@container`. How it is laid out depends on the device:
- **default (desktop, has hover):** fills the width, same as before.
- **`pan:`** (portrait and < 768px, i.e. phones held upright): the scene is as tall as the screen and scrolls sideways inside `<main>`. There are snap points at the left edge, at the Screen and at the right edge, and the page opens centred on the Screen. Keep a snap point at both edges, otherwise WebKit re-snaps back to the Screen whenever the layout changes.
- **`fit:`** (touch devices that aren't `pan`: tablets, phones held sideways): the scene is contained 16:9 and centred.
- **`touch:`** (`hover: none`): anything that only appears on `hover:` must also have a `touch:` state (usually `touch:opacity-60`), because touch screens never trigger `hover:`. Labels that would overlap when they are all visible at once (the volume labels) stay hidden.

Text: `body *` is `clamp(11px, 1.25cqw, 16px)` in `@layer base`, so it scales with the scene width (16px from a 1280px scene upwards). A `text-*` class overrides it. Keep the rule inside the layer: an unlayered rule beats every Tailwind utility.

Touch targets: tiny buttons get a transparent `touch:before:` hit area (see `Volume.jsx` / `classNameHitArea`). Aim for 44px in `pan` mode.

### Images

The backgrounds come from `src/assets/bg/` as AVIF/WebP at 1280/1920/2560 px, used via `<picture>` and `srcset` (`src/assets/bg/index.js`). They are generated from `src/assets/pull.png` / `pull2.png` by `npm run optimize:images` (sharp). Re-run it after changing a source PNG and commit the output. Don't import the PNGs directly, because each one is 4.6MB.

`npm run perf` (needs `npm run preview -- --port 4173`) measures a cold load on Slow 4G with 4x CPU throttling (`scripts/measure-perf.mjs`) on mobile, tablet and desktop.

## Conventions

- Import from `src` with the `@/` alias (`@/components/...`, `@/assets/...`).
- 4-space indent, double quotes, trailing commas in source files (`eslint.config.js` itself uses 2 spaces / single quotes, so leave it as is).
- Tailwind v4 through `@tailwindcss/vite` (no `tailwind.config.js`). Arbitrary values like `w-[9.0625%]` and `rotate-[-8.02deg]` are normal here.
- React Compiler is enabled (`babel-plugin-react-compiler`), so don't add `useMemo`/`useCallback` by hand for performance.
- ESLint `no-unused-vars` fails the build in CI, so remove unused imports and refs.
- Code comments may be in Vietnamese.

## Workflow

For a new feature or change request, use `/analyze-request <yêu cầu>`. Plans live in `.claude/plans/`. When you finish an item, tick its checkbox in the plan file right away. See `.claude/README.md`.
