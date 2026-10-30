# QA and Portfolio Evidence

All files here were regenerated on 2026-10-26 after the repair phase described in the root `AUDIT_REPORT.md`.

| File | Contents |
| --- | --- |
| `unit-results.json` | Vitest 4 JSON report of the final unit/component run |
| `e2e-results.json` | Playwright JSON report of the final full browser run B (41 passed, 2 load-induced timeouts; written by `playwright.config.ts`) |
| `e2e-retry-results.json` | Targeted `--last-failed` repeat of those two scenarios (2 passed) |
| `verification-summary.json` | Counts copied from those two reports, plus dependency-audit and build results |
| `build-summary.json` | Sizes measured from the real production build in `dist/` |
| `performance.json` | FCP / LCP / CLS / transfer measured on the production preview with Edge (local loopback, not field data, not Lighthouse) |
| `screenshot-results.json` | Screenshot count and page runtime exceptions from the capture script |

Read the root `TEST_REPORT.md` for outcomes and scope; the presence of a report alone does not prove a passing run.

## Portfolio screenshot index

| File | Capture |
| --- | --- |
| [01-home-desktop.png](screenshots/01-home-desktop.png) | Desktop homepage first screen, 1440 × 1000 |
| [02-home-desktop-full.png](screenshots/02-home-desktop-full.png) | Complete desktop homepage |
| [03-home-mobile.png](screenshots/03-home-mobile.png) | Complete mobile homepage, 390px wide |
| [04-shop-desktop.png](screenshots/04-shop-desktop.png) | Complete desktop catalog with category tabs, search, price range and sorting |
| [05-shop-mobile.png](screenshots/05-shop-mobile.png) | Complete mobile catalog |
| [06-product-desktop.png](screenshots/06-product-desktop.png) | Desktop product page with size cards, quantity note and related products |
| [07-product-mobile.png](screenshots/07-product-mobile.png) | Mobile product page first screen with name, price and purchase bar |
| [08-cart-mobile.png](screenshots/08-cart-mobile.png) | Populated mobile bag |
| [09-cart-desktop.png](screenshots/09-cart-desktop.png) | Populated desktop bag |
| [10-checkout-desktop.png](screenshots/10-checkout-desktop.png) | Desktop demo checkout with progress and itemised summary |
| [11-checkout-validation-mobile.png](screenshots/11-checkout-validation-mobile.png) | Mobile error summary and field errors after an empty submission |
| [12-checkout-review-desktop.png](screenshots/12-checkout-review-desktop.png) | Desktop review step with sample details |
| [13-demo-confirmation-desktop.png](screenshots/13-demo-confirmation-desktop.png) | Simulated order confirmation with subtotal, shipping and total |
| [14-wishlist-mobile.png](screenshots/14-wishlist-mobile.png) | Mobile wishlist |
| [15-menu-mobile.png](screenshots/15-menu-mobile.png) | Mobile navigation drawer with categories and counts |
| [16-about-desktop.png](screenshots/16-about-desktop.png) | Complete desktop philosophy page |
| [17-contact-mobile.png](screenshots/17-contact-mobile.png) | Complete mobile contact form |
| [18-home-mobile-viewport.png](screenshots/18-home-mobile-viewport.png) | Mobile homepage first screen, 390 × 844 |

Run `node scripts/capture-portfolio.cjs` while the app is serving at `http://127.0.0.1:5175/` to recreate these captures. The script uses a clean browser context, adds products through the visible UI, fills the checkout with fictional sample details and completes the local demo order. Nothing is transmitted.

Playwright traces and its HTML report are ignored build products in `test-results/` and `playwright-report/`; regenerate them with `pnpm test:e2e`.
