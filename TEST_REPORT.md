# ShopMini / AURA — Test Report

Final verification date: **2026-10-26** (repair phase after the independent audit in `AUDIT_REPORT.md`). Windows 11, Node.js 24.22.1, pnpm 11.25.0, Vite 7.3.7, Vitest 4.1.12, Playwright 1.64.1, Microsoft Edge (Chromium).

## Results

| Check | Command | Actual result |
| --- | --- | --- |
| Strict TypeScript | `tsc -b --force` | **Passed**, exit 0 |
| Production build | `vite build` | **Passed**; entry JS 299.68 kB (95.72 kB gzip), CSS 54.04 kB (11.72 kB gzip), 8 lazy route chunks |
| Vitest + React Testing Library | `vitest run` | **50 passed, 0 failed, 0 skipped** in 4 files |
| Playwright, full run A | `playwright test` | **43 passed, 0 failed, 0 skipped, 0 flaky** in 5.9 min |
| Playwright, full run B (final code) | `playwright test` | **41 passed, 2 failed, 0 skipped** in 20 min — both failures were timeouts (a 5 s heading wait and the 90 s test budget) while CPU was at 100% from unrelated applications |
| Playwright, targeted repeat of run B failures | `playwright test --last-failed` | **2 passed, 0 failed** in 35 s |
| Automated accessibility (axe, inside Playwright) | WCAG 2.0/2.1 A/AA on 9 routes; WCAG 2.0/2.1/2.2 A/AA on 6 populated routes at 375 and 1440 px | **21 scans, 0 violations** |
| Dependency audit | `pnpm audit` | **No known vulnerabilities found** (after upgrading Vitest 3.2.7 → 4.1.12) |
| Portfolio capture | `node scripts/capture-portfolio.cjs` | **18 screenshots**, 0 page runtime exceptions |
| Production-preview web vitals | custom Playwright/Edge script, 3 runs | CLS ≤ 0.0546 on every route (was 0.28–0.32 on `/shop` and product pages before repair). Timings varied widely between runs; see `qa/performance.json` |

Run B differs from run A only by one CSS selector change (`.contact-note` specificity instead of `!important`). Run B is therefore **not** reported as fully green: every scenario has an observed pass (run A, and run B plus its repeat), but the final full run itself had two environment-induced timeouts. The failed scenarios were “all pages fit a 1920px viewport” and “direct visits to lazy routes do not shift the layout”; the failure screenshot shows the page fully rendered after the deadline.

Machine-readable evidence: `qa/unit-results.json`, `qa/e2e-results.json` (run B), `qa/e2e-retry-results.json` (repeat), `qa/verification-summary.json`, `qa/build-summary.json`, `qa/performance.json`, `qa/screenshot-results.json`.

## Unit and component coverage (50 tests)

- **Commerce logic (42):** integer-cent totals checked against independently calculated values (€204.00 multi-line bag; €74.00 + €4.90 just under the threshold), exact €75 shipping boundary, variant prices, quantity normalisation, merge limits with the number of units actually accepted, invalid lines never billed (zero/negative/fractional quantities, unknown sizes, unknown or unavailable products), stored prices ignored, only whole stored quantities 1–10 accepted, catalog-derived price bounds (€18–€48), inclusive minimum/maximum boundaries, every slider position being meaningful, combined category + minimum price + sort, safe parsing of hostile URL parameters (unknown category/sort, non-numeric and inverted price ranges), search, sorting, wishlist toggles, storage read/write/malformed/unavailable cases, checkout validation, errors in on-screen field order, and demo order IDs with and without `crypto.randomUUID`.
- **Shopping state (4):** persistence and remount restore; no overwrite of corrupted data on mount; partial additions at the 10-per-size limit report “Only 2 added” and a full line reports the maximum; rapid repeated wishlist toggles are evaluated against the latest state.
- **Checkout component (2):** error summary plus focus on the first invalid field in visual order (postal code before country); totals on review (€74.00 + €4.90 = €78.90); double-click creates one order; confirmation heading receives focus; receipt shows shipping and total; customer email never reaches storage.
- **Contact (2):** required fields, first-invalid-field focus (now in on-screen order) and truthful local success.

## Browser coverage (43 Playwright scenarios, Edge, single worker)

1. Editorial anchors and reduced-motion back-to-top.
2. Browse → search → category → sort → price → empty state → reset → reload.
3. Product page: one honest image, variant price change, quantity, wishlist persistence, bag totals, removals, empty states, per-page title.
4. Validated demo checkout: error summary, first-field focus, edit flow, exact totals, focused confirmation with shipping line, no non-GET requests, no customer data in storage, refresh clears the receipt.
5. Mobile navigation, search dialog and contact demo.
6. Keyboard: skip link, dialog focus, Escape and focus restoration, newsletter feedback.
7. Unavailable product cannot be bought; malformed storage keeps valid entries and unrelated keys.
8–13. All eight page types at **375, 390, 768, 1024, 1440 and 1920 px**: no horizontal overflow, all images decode, no runtime errors.
14–21. axe on eight routes (empty states).
22–33. axe on six routes with a populated bag and wishlist at 375 and 1440 px (WCAG 2.2 AA tags included).
34. Quantity limit: 8 + 2 reaches 10, selector capped by what still fits, disabled “Maximum already in your bag”, other size unaffected, cart increase disabled with a visible limit note, card quick-add at the limit does not claim success, €420.00 subtotal.
35. Price range: minimum and maximum sliders both change results, combine with category, reach an empty state, reset, and recover from an inverted/hostile URL.
36. Document titles for home, catalog, category, product, unknown product, bag, checkout and unknown route.
37. Mobile product page: name and price in the top 45% of a 390 × 844 screen; purchase bar appears when the main controls are out of view and adds to the bag.
38. Mobile header: visible wishlist, no header, card-button or footer control narrower than 44 px or shorter than 40 px, and no card title link shorter than 24 px, drawer with categories closes on Escape and on navigation.
39–40. Readable type at 375 and 1440 px on all eight routes: no visible text below 12px and every visible form control at 16px or larger.
41. Direct visits to seven lazy routes: CLS < 0.1 each.
42. Corrupted storage cannot inject prices or invalid quantities (€56.00 + €4.90 = €60.90); malformed JSON falls back to an empty bag.
43. axe on a populated checkout.

## Defects found and corrected during this phase

- A first full run surfaced two failures: one test counted error text that now also appears in the error summary (test corrected to count field errors), and **a real CLS of 0.128 on the empty bag** (footer moving up after the loading state). `main` now always fills the viewport; the CLS test was extended to seven routes and passed.
- The contact form had the same focus-order bug as checkout (format errors were added after required errors); fixed.

## Scope and limitations

- Only Chromium-based Microsoft Edge on Windows with emulated viewports was used. **Safari, Firefox, iOS/Android devices and screen readers were not tested.** The 16px input rule is meant to prevent iOS focus zoom; that behaviour was not observed on a device.
- axe results are automated checks, not a full accessibility audit or legal certification.
- No Lighthouse score is claimed (Lighthouse is not installed). Web-vital timings were measured on a busy local machine and varied by up to several seconds between runs; only CLS is presented as a stable result.
- Product photography is AI-generated concept imagery with one image per product; see `ASSET_CREDITS.md` for missing assets and known label differences.
- No backend, payment processing, real inventory, delivered message, newsletter subscription, shipping integration or external order exists.

## Isolation and delivery safety

All work stayed inside this independent repository (`05-shopmini`, branch `codex/shopmini`). No changes were made to `01-fixlab`, `02-pixelperfect`, `03-luxe`, `04-motioncraft`, the parent workspace or its Git index. Nothing was pushed or deployed. The temporary production preview on port 4185 was stopped after measurement.
