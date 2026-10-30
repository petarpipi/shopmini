# ShopMini — AURA

A complete, local, interactive e-commerce frontend for a fictional premium skincare brand. Created as Project 05 of a professional Upwork portfolio. English interface and source code; no backend or real transactions.

## Run locally

Requirements: Node.js 22.12+ and pnpm 11. The lockfile records the installed dependency versions.

```sh

pnpm install --frozen-lockfile
pnpm dev
```

Open **http://127.0.0.1:5175/**. The strict port prevents silently starting on a different port or replacing another project’s server. Stop this server with Ctrl+C in its own terminal.

```sh
pnpm typecheck          # Strict TypeScript, including tests
pnpm build              # TypeScript + production bundle in dist/
pnpm preview            # Production preview at http://127.0.0.1:4185/
pnpm test               # Vitest + React Testing Library
pnpm test:watch
pnpm test:e2e           # Playwright + axe accessibility checks
pnpm test:e2e:ui
node scripts/capture-portfolio.cjs
```

Playwright uses installed Microsoft Edge on Windows, and Chromium elsewhere. Install Chromium with `pnpm exec playwright install chromium` on non-Windows systems. On Windows, install Edge or change the `channel` setting in `playwright.config.ts` and the screenshot script. Tests reuse this project’s server, or start it if it is absent. Never stop another project’s process to obtain a port.

## Experience

- Editorial homepage, collection, product detail, bag, wishlist, checkout, philosophy, and contact pages.
- Twelve typed local products across four categories, with EUR prices, sizes, availability, original copy, and concept imagery.
- URL-backed catalog search, category and maximum-price filters, name and price sorting, reset, and empty states.
- Product detail pages with one honest product image (no padded gallery), size cards with prices, quantity controls limited by what still fits in the bag, add-to-bag and wishlist actions, native accordions, and a compact mobile purchase bar.
- Catalog price range with independent minimum and maximum sliders derived from the catalog's starting prices, plus validated URL parameters.
- Per-page document titles and meta descriptions, including product names and “not found” states.
- Readable type scale (12px minimum for short uppercase labels, 14–16px for reading text, 16px for every form control) and 44px touch targets.
- Restrained CSS micro-interactions for add-to-bag, wishlist, counters, filter results, totals and checkout steps; all disabled under `prefers-reduced-motion`.
- Bag line items are identified by product and size. Quantities are integers from 1 to 10 per line. Totals use integer cents.
- Simulated shipping costs €4.90 below €75 and is complimentary at or above €75. Empty bags cost zero.
- Persisted bag and wishlist, validated record by record, cross-tab synchronization, and graceful storage failure handling. Other applications’ storage keys are never changed.
- Customer and shipping validation, editable review, and a clear local demo confirmation. No card fields, payment integrations, network submission, or stored customer details.
- Local contact and newsletter validation with truthful demonstration success messages.
- Native modal navigation/search, keyboard focus management, skip link, screen-reader feedback, reduced-motion support, and back-to-top.
- Responsive layouts, self-hosted fonts, responsive WebP images, and lazy-loaded secondary routes.

## Technology

React 19, TypeScript 5.9, Vite 7, React Router 7, Lucide React, React Context, Vitest 4, React Testing Library, Playwright, and axe-core. Styling is hand-written CSS with design tokens; Tailwind CSS 4 supplies the `@theme` tokens and base reset only, not utility-class layouts. Motion is handled through restrained CSS transitions; no animation dependency is needed for this experience.

## Source map

```text
src/data/products.ts       Product and variant models, local catalog, EUR formatter
src/lib/commerce.ts        Pure cart/filter/storage/validation functions
src/state/Store.tsx        Shopping context and persistence lifecycle
src/components/           Shared navigation, cards, controls, totals and newsletter
src/pages/                Eight page implementations
src/lib/usePageMeta.ts    Document title and meta description per page
src/styles.css            Type scale, design tokens, editorial styling and responsive rules
src/test/                 Unit-test setup
e2e/store.spec.ts          User journeys, responsive checks and accessibility
qa/                       Reports, evidence and portfolio screenshots
public/images/            Local generated assets and responsive versions
public/licenses/          Bundled font and icon license notices
```

## Persistence and privacy

Only `shopmini-aura-v1` is used in LocalStorage. It contains product IDs, variant names, integer quantities, and wishlist IDs — never prices; totals always come from the typed catalog. Stored quantities must be whole numbers from 1 to 10, and pricing functions skip any line that is not a known, in-stock product size. Reads tolerate unavailable storage, malformed JSON, and mixed valid/invalid records. No storage write occurs on initial mount, so malformed original JSON is retained until the visitor makes a shopping change. Valid sibling cart/wishlist entries survive sanitization. Customer, contact, and newsletter values exist only in component memory. Checkout and contact values are cleared on successful demonstration. Refreshing or leaving checkout discards entered customer details and any demo receipt.

There is no backend, analytics, external font request, mailing list, checkout provider, or contact endpoint. Development HMR traffic is a Vite feature; it does not submit form contents.

## Portfolio and audit

See [PORTFOLIO.md](PORTFOLIO.md), [TEST_REPORT.md](TEST_REPORT.md), [ASSET_CREDITS.md](ASSET_CREDITS.md), [AUDIT_HANDOFF.md](AUDIT_HANDOFF.md), and the original [PROJECT_BRIEF.md](PROJECT_BRIEF.md). Screenshot files are in `qa/screenshots/`. Image generation prompts and original source filenames are recorded in `asset-generation.json`; compressed assets are already included and need no generation service at runtime.

This project is prepared for a standalone GitHub repository. Build and development commands run from the repository root.

## Demonstration limits

AURA and its catalog are fictional. Images are AI-created packaging visualizations; small label text and rendered volumes may differ from catalog details. Each product has exactly one image, so product pages show a single image rather than a simulated gallery; size-specific or multi-angle photography does not exist. Ingredient lists are concept copy, not complete cosmetic formulations or verified benefits. Inventory and shipping are simulated. Editorial favorites imply no real sales rankings. The app is a frontend portfolio demonstration, not a production commerce system.

## GitHub and Cloudflare Pages

Prepared as the standalone **shopmini** repository. Run all commands from the cloned repository root. The package name is `shopmini-aura`; it is an internal package identifier. `private: true` prevents accidental npm publication and does not make a GitHub repository private.

| Setting | Value |
| --- | --- |
| Framework | React, TypeScript, React Router and Vite |
| Package manager | pnpm 11.25.0 |
| Verified Node.js | 24.22.1 |
| Build command | `pnpm install --frozen-lockfile && pnpm run build` |
| Build output | `dist` |
| Root directory | Leave empty (repository root) |
| Required application secrets | None |

The existing `build` package script also works with `npm run build` after dependencies are installed; pnpm is used for reproducible installation from the committed lockfile. See [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md) for the build environment and connection instructions.

This repository is a frontend portfolio demonstration. No hosting deployment is performed by these preparation steps.
