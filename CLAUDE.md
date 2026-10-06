# CLAUDE.md

Single-page interactive landing page (React 19 + Vite 8 + Tailwind CSS v4), JavaScript only (no TypeScript). Served as static files by nginx in Docker.

## Commands

- `npm run dev`: Vite dev server
- `npm run lint`: ESLint (flat config, `eslint.config.js`)
- `npm run build`: production build to `dist/`
- `docker compose up --build`: build and serve via nginx

- `npm run test:e2e`: Playwright E2E tests in `e2e/` (Chromium). Locally they start the dev server on :4173. With `CI=1` they run `build` + `preview`. YouTube requests are blocked inside the tests.
- `npm run test:e2e:ui` / `npm run test:e2e:report`: interactive UI mode / last HTML report

CI (`.github/workflows/test-and-lint.yml`) runs `npm install`, then lint, build and E2E on Node 25. Run lint, build and `test:e2e` before you call a change done. There are no unit tests. Use Playwright for UI behavior and for checking % positions at several viewport widths (see `e2e/home.spec.js`).

Both `package-lock.json` and `pnpm-lock.yaml` exist. CI uses npm, and the Dockerfile tries pnpm first. Use npm unless told otherwise, and keep both lockfiles in sync when you change dependencies.

## Architecture

- `src/App.jsx`: the whole scene. A 2560×1440 background image (`src/assets/pull.png`, with a low-quality placeholder underneath) and absolutely positioned interactive elements on top of it.
- `src/components/ImageFrame.jsx`: a clickable image that links out (opens in a new tab) and shows a hover label.
- `src/components/MusicPlayer.jsx`: three "disc" buttons that play YouTube audio through `react-youtube`, plus a volume popup (`Volume.jsx`, `Disc.jsx`).
- `src/utils/cn.js`: `cn()` = `clsx` + `tailwind-merge`. Use it to combine class names.

### Positioning convention

Everything on top of the background is positioned in **percentages of the 2560×1440 background**, so the layout scales with the image:
- x / left / width = `px / 2560 * 100` (e.g. `475px` → `18.5546875%`)
- y / top / height = `px / 1440 * 100` (e.g. `519px` → `36.041666666%`)

When adding or moving an element, take its pixel coordinates from the design and convert them this way. Don't use fixed px or breakpoints.

## Conventions

- Import from `src` with the `@/` alias (`@/components/...`, `@/assets/...`).
- 4-space indent, double quotes, trailing commas in source files (`eslint.config.js` itself uses 2 spaces / single quotes, so leave it as is).
- Tailwind v4 through `@tailwindcss/vite` (no `tailwind.config.js`). Arbitrary values like `w-[9.0625%]` and `rotate-[-8.02deg]` are normal here.
- React Compiler is enabled (`babel-plugin-react-compiler`), so don't add `useMemo`/`useCallback` by hand for performance.
- ESLint `no-unused-vars` fails the build in CI, so remove unused imports and refs.
- Code comments may be in Vietnamese.

## Workflow

For a new feature or change request, use `/analyze-request <yêu cầu>`. Plans live in `.claude/plans/`. When you finish an item, tick its checkbox in the plan file right away. See `.claude/README.md`.
