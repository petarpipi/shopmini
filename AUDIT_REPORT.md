# ShopMini / AURA — Audit and Repair Report

This report has two parts:

- **Part 2 — Repair phase (final state).** What was fixed, what remains, final test evidence and scores. Read this first.
- **Part 1 — Initial independent audit** (commit `fb1aab0`, before any repair). Kept unchanged below as the baseline; its line numbers refer to that commit.

Restore point before repairs: commit `7324a15` (“Add independent audit report (pre-repair restore point)”).

---

# Part 2 — Repair phase (final state, 2026-10-26)

## 2.1 Initial problems (summary)

The baseline audit scored the project **7.0/10** and found 1 CRITICAL, 3 HIGH, 12 MEDIUM and 15 LOW issues. The decisive problems were: 5–11px text across the site (C-1), CLS 0.28–0.32 on lazy routes (H-1), quantity merges silently capped with a “added” message (H-2), and a product “gallery” built from duplicated images (H-3).

## 2.2 Problems corrected

| ID | Status | Fix | Regression coverage |
| --- | --- | --- | --- |
| C-1 tiny text | **Fixed** | `styles.css` rewritten around a token type scale: 12px minimum for short uppercase labels, 14–16px reading text, 16px for every input/select/textarea, larger product names, prices and form labels. The 5–8px values are gone. | E2E “readable type” at 375 and 1440 px on all eight routes (no visible text < 12px, no visible control < 16px) |
| H-1 CLS | **Fixed** | `main` always fills the viewport and the Suspense fallback is full height, so the footer never enters the first screen and then jumps; shop/product chunks are prefetched on idle. A first fix still left 0.128 on the empty bag; found by the new test and corrected. | E2E CLS < 0.1 on seven directly visited routes; production preview: CLS ≤ 0.0546 (was 0.317) |
| H-2 silent cap | **Fixed** | `addItemWithResult` returns the units actually accepted; the store reports “Only N added — limit of 10” or “already holds the maximum”; the product quantity selector is capped at what still fits, the button becomes “Maximum already in your bag”, and an `aria-live` note explains the limit. Cart shows “Limit of 10 per size reached.” | Unit (commerce + store) and E2E quantity-limit journey (€420.00 at 10 × €42) |
| H-3 fake gallery | **Fixed by removal** | No additional licensed images exist, so product pages now show the one real product image (responsive `srcSet`, `fetchpriority="high"`) with an honest caption. No image variations were fabricated. Missing assets are listed in `ASSET_CREDITS.md`. | E2E asserts exactly one product image and no gallery controls |
| M-1 confirmation not announced | Fixed | Confirmation `h1` receives focus; receipt is a labelled section. | Unit + E2E `toBeFocused()` |
| M-2 wrong focus on shipping | Fixed | Validation returns errors in on-screen field order; `firstInvalidField()` drives focus. Same bug found and fixed in the contact form. | Unit + component test (postal code before country) |
| M-3 prefilled-looking placeholders | Fixed | Name/address placeholders removed; email and postal code have described hints instead. Error summary (`role="alert"`) links to each invalid field; field errors carry an icon and are referenced by `aria-describedby`. | Component test checks accessible description; E2E error summary |
| M-4 hero overlay contrast | Fixed | Label now sits on a solid ivory card. | Visual review; axe |
| M-5 touch targets | Fixed | 44 × 44 header icons, favourite and quick-add buttons; 40px+ footer links; 44px category tabs, sort select, sliders. | E2E target-size scan at 375 px |
| M-6 mobile PDP hierarchy | Fixed | Mobile order is name → price → image (1:1) → size cards → quantity/CTA → description; a compact purchase bar slides in whenever the main controls are out of view and reserves space so it never permanently covers content. | E2E: name and price in the top 45% of 390 × 844; bar appears and adds to bag |
| M-7 wishlist hidden on mobile | Fixed | Wishlist icon with counter always visible; menu is a full-height drawer with categories and wishlist/bag counts. | E2E mobile header and drawer |
| M-8 oversized images | Fixed | Thumbnails removed; cards, cart, summary and review use 480px files; the PDP image and hero use `srcSet`/`sizes`. | Network inspection; build summary |
| M-9 dead price range | Fixed | Separate minimum and maximum sliders bounded by catalog data (€18–€48, starting price of the smallest size), validated URL params, inverted ranges swapped, active-range fill. | Unit (bounds, boundaries, every position meaningful) + E2E price journey |
| M-10 generic titles | Fixed | `usePageMeta` sets title and description per page, including product names, “Product not found” and “Page not found”. | E2E titles on eight routes |
| M-11 dev advisories | Fixed | Vitest 3.2.7 → 4.1.12; `pnpm audit`: no known vulnerabilities. | Audit + full test run on Vitest 4 |
| M-12 test blind spots | Fixed | +14 unit/component tests (36 → 50) and +21 E2E scenarios (22 → 43), including populated/mobile axe scans with WCAG 2.2 tags. | — |
| L-1 lenient pricing | Fixed | `totals()` skips any line that is not a known, in-stock size with a whole quantity 1–10; `unitPrice()` returns `null` for unknown items. | Unit |
| L-2 fractional stored quantities | Fixed | Only integer 1–10 accepted on load. | Unit + E2E corrupted storage |
| L-3 stale toast state | Fixed | Store mirrors latest state in a ref; rapid toggles report correctly. | Unit |
| L-4 `randomUUID` | Fixed | `createDemoOrderId` fallback. | Unit |
| L-5 receipt | Fixed (breakdown) | Receipt lists subtotal, demo shipping and total, and states it disappears on refresh. | Unit + E2E |
| L-6 invalid sort | Fixed | Sort values whitelisted. | Unit + E2E |
| L-7 heading order / region | Fixed | Visually hidden h2s; announcement in a labelled landmark; footer columns are labelled navs. | Re-run of axe `best-practice` on 12 populated page/width combinations: 0 findings (was `region` everywhere and `heading-order` on shop/wishlist) |
| L-8 wishlist order, size | Fixed | Most recently saved first; quick-add names the size it adds. | E2E |
| L-10 clip-art flower | Fixed | Removed. | Visual |
| L-11 odd link | Fixed | “Explore the collection” goes to `/shop`. | — |
| L-13 Tailwind claim | Fixed (docs) | README/PORTFOLIO now describe custom CSS tokens with the Tailwind theme layer. | — |
| L-14 out-of-stock card | Fixed | No disabled bar over the photo; a clear “Coming back soon” badge and the wishlist action remain. | E2E |
| L-15 mobile menu | Fixed | Drawer with categories and counts. | E2E |

## 2.3 Remaining problems

| ID | Severity | Remaining issue | Why it remains / what would fix it |
| --- | --- | --- | --- |
| R-1 | MEDIUM | One image per product; no texture, back-label, scale or size-specific shots. `hero.webp` is the only editorial image and is reused three times (home hero, philosophy, About). Label text differs from some names (e.g. “Daily Serum”). Gentle Milk Cleanser and Soft Foam Cleanser use near-identical bottles. | Needs new, consistently produced and documented assets. Not fabricated. |
| R-2 | MEDIUM | Not tested in Safari/iOS, Firefox, Android or with a screen reader. | Tooling not available in this session. |
| R-3 | LOW | Timing metrics (FCP/LCP) varied by seconds between runs on this machine; no Lighthouse run. Fonts (5 WOFF2) and the LCP image are not preloaded with `<link rel="preload">`. | Measure on a quiet machine or CI; consider preloading Manrope 400 and the hero. |
| R-4 | LOW | `styles.css` is still one ~3,000-line file; Tailwind is only used for the theme layer. | Split by area or migrate layouts to utilities in a later refactor. |
| R-5 | LOW | On a 390 × 844 phone the main “Add to bag” button is still just below the first screen; the purchase bar covers this. | Acceptable trade-off for a full product image. |
| R-6 | LOW | The contact form shows field errors without a summary (checkout has one). | Small consistency improvement. |
| R-7 | LOW | Price filters and sorting use the smallest size’s price (stated in the catalog note). | Product decision, documented. |

## 2.4 Testing results (executed)

| Check | Result |
| --- | --- |
| `tsc -b --force` | Passed |
| `vite build` | Passed — entry JS 299.68 kB (95.72 kB gzip), CSS 54.04 kB (11.72 kB gzip), 8 route chunks |
| Vitest 4.1.12 | **50 passed / 0 failed / 0 skipped** |
| Playwright 1.64.1 (Edge), full run A | **43 passed / 0 failed / 0 skipped / 0 flaky** (5.9 min) |
| Playwright, full run B on final code (one CSS selector later) | **41 passed / 2 failed** (20 min, CPU at 100% from unrelated apps; both failures were timeouts) |
| Playwright, targeted repeat of run B failures | **2 passed / 0 failed** |
| axe (inside Playwright) | 21 scans, 0 violations (incl. populated pages at 375 and 1440 px with WCAG 2.2 AA tags) |
| `pnpm audit` | No known vulnerabilities |
| Screenshot capture | 18 screenshots, 0 runtime exceptions |

Journeys covered end-to-end: home → catalog → product → bag; search → filter → sort → product; wishlist → bag → quantity; bag → checkout → demo confirmation; invalid checkout → errors → corrected → confirmation; refresh persistence; corrupted LocalStorage (injected prices, invalid quantities, malformed JSON); mobile browse and checkout. All money values were asserted against independently calculated integer-cent expectations. Details in `TEST_REPORT.md`.

## 2.5 Visual improvements

Token type scale with clear hierarchy (editorial product names at 22–25px, 15–16px prices, 12px tracked labels); hero caption on a solid card; product cards with “From €X”, size list, hover/focus-revealed “Add to bag · size” on desktop and a 44px round action on touch; size cards that show each size’s price; checkout with numbered progress, step count, error summary, itemised order summary with thumbnails and a receipt with subtotal/shipping/total; drawer navigation; clip-art removed. Restrained motion: card fade-in on filter changes, button “Added” state, counter pop, heart pop, price/total cross-fade, step transitions, drawer slide-in — all disabled by `prefers-reduced-motion`.

## 2.6 Mobile UX improvements

Symmetric header (menu + search | AURA | wishlist + bag) with count badges; product name and price before the image; size cards and quantity directly under the image; sticky purchase bar; 16px inputs; single-column checkout with full-width primary action; horizontally scrollable category tabs; 44px targets throughout. No horizontal overflow at 375, 390, 768, 1024, 1440 or 1920 px.

## 2.7 Performance results

Production preview, Edge, three runs (`qa/performance.json`). **CLS:** max 0.0546, typical 0.0002–0.005, on `/`, `/shop`, product, bag and checkout (before: 0.317 / 0.289 on shop / product). **Transfer:** 178–511 KB per route including images. **Timings:** desktop FCP medians 336–496 ms on inner pages, but the home page and individual runs ranged from ~0.3 s to ~3.4 s on this busy machine, so no timing improvement is claimed. Bundle grew by 5 kB (gzip +1.3 kB).

## 2.8 Accessibility results

0 axe violations on 21 scans and 0 `best-practice` findings on 12 additional populated scans; 1–13 `color-contrast` “incomplete” nodes per page remain for text over photographs (axe cannot compute these; checked visually). Focus managed on step changes, errors and confirmation; error summary with `role="alert"` and links; hints and errors connected via `aria-describedby`; visible focus rings (including custom size cards and range thumbs); 44px targets; readable type enforced by tests; reduced motion respected. Not verified with assistive technology.

## 2.9 Scores after repair

| Area | Before | After | Evidence |
| --- | --- | --- | --- |
| Visual Design | 6 | **8.5** | Readable hierarchy and refined components; held back by single-image products and a reused editorial image |
| Brand Consistency | 8 | **8.5** | Consistent palette, type and photography; minor label/name mismatches |
| Product Catalog | 8 | **9** | Meaningful min/max range, safe URL state, accurate counts and empty states |
| Product Detail Experience | 6 | **8.5** | Clear mobile hierarchy, honest limits, size cards; one image only |
| Shopping Cart Reliability | 8.5 | **9.5** | Integer cents, strict validation, accurate partial-add feedback, extensive tests |
| Checkout Experience | 7.5 | **9** | Error summary, correct focus, hints, focused truthful confirmation with breakdown |
| Responsive Design | 6.5 | **9** | Six widths without overflow, mobile header/drawer/purchase bar |
| Accessibility | 6.5 | **8.5** | Automated checks and focus management strong; no screen-reader or device testing |
| Performance | 7 | **8** | CLS fixed and right-sized images; timings unverified; no preloads |
| Security & Data Handling | 8.5 | **9** | No transmission, no stored prices/PII, clean audit; frontend-only by design |
| Code Quality | 7.5 | **8.5** | Typed pure logic, fewer duplicates, tokens; CSS still one large file |
| Upwork Portfolio Readiness | 6.5 | **9** | Polished, honest and well-tested; photography is the visible limit |

**Overall: 8.8 / 10** (up from 7.0). Not rounded up to 9+: the remaining gap is photography depth (R-1) and untested real devices/browsers (R-2), which cannot be closed with code alone.

## 2.10 Portfolio readiness verdict

**Ready for public portfolio use** as a frontend e-commerce demonstration. It now looks like a considered premium store on desktop and phones, its bag and checkout behave correctly and truthfully, and the evidence is reproducible. It must continue to be presented as a fictional demo without real payments or orders. The most valuable next steps are additional consistent product imagery (R-1) and a real-device Safari/screen-reader pass (R-2).

---

# Part 1 — Initial independent audit (baseline, unchanged)

Audit date: 2026-10-26 · Auditor: Claude Code (independent review) · Branch `codex/shopmini` at `fb1aab0` · Working tree clean before and after the audit.

No application source was modified. The only file created in the repository is this report. Temporary builds, scripts and measurements were written outside the repository (system temp / session scratchpad). The pre-existing `qa/` evidence files were not overwritten.

---

## 0. What was actually executed

| Check | Command / method | Result |
| --- | --- | --- |
| TypeScript | `tsc -b --force` | **Pass**, exit 0 |
| Unit + component tests | `vitest run` | **36 passed / 0 failed / 0 skipped** (3 files) |
| Production build | `vite build` (output to temp dir) | **Pass**. Entry JS 294.69 kB (94.39 kB gzip), CSS 48.58 kB (10.71 kB gzip), 8 route chunks 0.7–7 kB |
| Playwright E2E | `playwright test --reporter=list` (reused dev server on 5175, Edge) | **22 passed / 0 failed / 0 skipped** in 1.4 min |
| Dependency audit | `pnpm audit` | 5 advisories, **all dev-only** (vitest chain): 2 critical (`tinypool`), 3 moderate (`vitest`, `@vitest/mocker`). Runtime dependencies: none |
| Extra axe scan (populated bag/wishlist, 375 + 1440 px, WCAG 2.0/2.1/2.2 A/AA) | Custom Playwright + `@axe-core/playwright` script against production preview | **0 violations** on 12 page/width combinations. Best-practice: `region` (all pages), `heading-order` (shop, wishlist). 1–25 `color-contrast` "incomplete" nodes per page (text over images, needs manual review) |
| Web-vitals measurement | Custom Playwright/Edge script on production preview (desktop unthrottled; mobile 375 px with 4× CPU + ~1.6 Mbps/150 ms) | See §Performance. **CLS 0.28–0.32 on /shop and product pages** |
| Manual browser testing | Built-in browser at 375, 768, 1024, 1440, 1920 px (dev + production preview) | Catalog, PDP, bag, wishlist, checkout, mobile menu, corrupted storage, invalid URLs |

**Not executed / not available:** Lighthouse (not installed; not added to avoid new dependencies), Safari/Firefox, physical devices, screen-reader session. The 390 px width was covered only by the existing Playwright overflow/broken-image scenario, not by manual inspection.

Side effect: test data was written to LocalStorage of the built-in browser profile for `127.0.0.1:5175` / `:4185`. Nothing outside that profile was touched.

---

## A. Overall evaluation

**Overall score: 7.0 / 10**

### Major strengths
- Commerce logic is genuinely solid: integer cents, catalog-sourced prices (persisted prices are ignored), product+size line identity, 1–10 quantity bounds, record-by-record storage sanitization that keeps valid siblings, no mount-time overwrite, cross-tab sync.
- Truthful demo framing everywhere: no card fields, no network submission (verified: only same-origin GETs during checkout), customer data cleared after confirmation and never persisted.
- Product photography is consistent and attractive: same travertine surface, warm side light, shared vessel system and wordmark across all 12 products.
- Real, passing automated suite (36 unit + 22 E2E incl. 9 axe checks) and honest documentation of limitations.
- Small, route-split bundle; self-hosted fonts; WebP images with 480 px variants.

### Major weaknesses
- **Micro-typography**: 167 of 260 pixel font-size declarations are ≤ 11 px, including 5–8 px text. Product descriptions are 9 px, form labels 10 px, error messages 10 px, mobile inputs 12 px. This is the single biggest quality problem and is visible immediately to any client.
- **Layout shift**: CLS 0.28–0.32 (Google "poor" > 0.25) when landing directly on any lazy route.
- **The product gallery is not real**: images 1 and 3 are the same file, image 2 is the same campaign hero for every product.
- Quantity merge above the limit is silently capped while the toast says it was added.
- Several checkout polish issues (focus order, confirmation not announced, placeholders that look like typed values).

### Portfolio readiness verdict
**Not yet ready for public use — close.** Functionally it would survive scrutiny from a technical client. Visually, the tiny type makes a premium design look unfinished on a normal laptop. The type-scale fix, the CLS fix and the gallery would move this to a confident 8+/10.

---

## B. Problems

Line numbers refer to commit `fb1aab0`.

### CRITICAL

#### C-1 · Pervasive sub-legible font sizes (5–11 px)
- **Location:** `src/styles.css` (e.g. L218 announcement 9px, L268 `.brand span` 6px, L350 header-actions 7px, L522 `.product-meta` 8px, L546 `.product-description` 9px, L1463 checkout steps 10px, L1514 form labels 10px, L1542 `.field-error` 10px `!important`, L1979 and L2401 **5px** in media queries); mobile `.form-field input` computes to 12px at 375 px.
- **Description:** Text that carries product information, prices context, form labels and validation errors is rendered at 5–11 CSS px across all breakpoints.
- **Root cause:** No type scale; 260 hard-coded px values. The sizes look like they were transcribed from a downscaled mockup.
- **Evidence:** Tally of `font-size: Npx` in styles.css: 5px×2, 6px×8, 7px×10, 8px×28, 9px×34, 10px×45, 11px×39. Computed in browser at 1440 px: brand tagline 6px, product badge 7px, product meta 8px, product description 9px. At 375 px: label 9px, input 12px, checkout steps 8px.
- **Impact:** Readability and perceived quality; iOS Safari zooms the page when focusing inputs < 16px; low-vision users. axe does not flag font size, which is why the suite passes.
- **Solution:** Introduce a token type scale in `@theme` (e.g. 12 / 13 / 14 / 16 / 18 / 20 / … ). Minimums: 12px for uppercase eyebrows with tracking, 14px for meta/description, 15–16px for body and labels, **16px for all inputs/selects on mobile**, 13–14px for errors. Replace raw px values with tokens.
- **Verification:** Script that lists computed font sizes < 12px on every route at 375 and 1440 → expect zero (or only purely decorative text). Add it to `e2e/store.spec.ts`. Visual comparison screenshots.

### HIGH

#### H-1 · CLS 0.28–0.32 on direct load of lazy routes
- **Location:** `src/App.tsx` L40–46 (Suspense fallback), `src/styles.css` L1041–1047 (`.page-loading { min-height: 480px }`).
- **Description:** On first load of `/shop`, `/product/*`, etc., the short fallback lets the footer render inside the first viewport; when the route chunk resolves, the footer is pushed down.
- **Root cause:** Fallback height unrelated to page height; footer rendered outside Suspense.
- **Evidence:** PerformanceObserver `layout-shift` sources: `FOOTER.site-footer` previousRect y=615 → off-screen; value 0.3167 (/shop), 0.289 (/product/daily-glow-serum) at 1440 px; 0.28 at 375 px. Home (eager) CLS 0.001.
- **Solution:** Give the fallback `min-height: 100vh` (or route-shaped skeletons), or move the footer inside the Suspense boundary, or preload the likely route chunk. Shop is small enough (3.8 kB) to import eagerly.
- **Verification:** Re-run the layout-shift observer on all routes; target CLS < 0.1.

#### H-2 · Quantity silently capped; toast and button price misrepresent the action
- **Location:** `src/state/Store.tsx` L73–92 (`add`), `src/lib/commerce.ts` L48–57, `src/pages/Product.tsx` L122–131.
- **Description:** With 8 in the bag, adding 5 results in 10 (only 2 added), but the toast says "Daily Glow Serum added to your bag" and the button read "Add to bag — €210.00".
- **Root cause:** `add` only blocks when the line is already at 10; `addItem` clamps afterwards without reporting the accepted amount.
- **Evidence:** Browser run: qty 8 → bag (8); set qty 5 → click → bag (10), toast "…added to your bag"; third click → "maximum of 10" message. Storage `quantity: 10`.
- **Solution:** Compute `accepted = min(requested, MAX - existing)`. If `accepted < requested`, toast "Only N more could be added (limit 10 per size)". On the PDP, cap the selector at `MAX - inBag` and show "N already in your bag".
- **Verification:** New unit test for the store and E2E: 8 + 5 → 10 with a "only 2 added" message.

#### H-3 · Product gallery is padded with duplicate and generic images
- **Location:** `src/pages/Product.tsx` L20–24, L57–79.
- **Description:** Every PDP shows: image 1 = product, image 2 = the same campaign hero (`hero.webp`) for all 12 products, image 3 = the product image again with a CSS crop.
- **Root cause:** Only one asset per product exists.
- **Evidence:** Gallery array in code; thumbnails 1 and 3 visibly identical at 375 px.
- **Impact:** An e-commerce client immediately recognises a fake gallery, which weakens the "product detail" showcase.
- **Solution:** Either produce 2–3 real angles per product (texture swatch, back label, in-hand/scale shot — consistent with the existing generation pipeline), or show a single large image without gallery controls. Keep the honest caption.
- **Verification:** Visual review; unique `src` per thumbnail.

### MEDIUM

#### M-1 · Demo confirmation is not announced to assistive technology
- **Location:** `src/pages/Checkout.tsx` L65–75, L112–150.
- **Description:** After "Complete demo order" the form unmounts; focus falls to `<main>`/body. The confirmation has no live region and its `h1` is not focused.
- **Evidence:** `document.activeElement` after completion: `MAIN#main`.
- **Solution:** `tabIndex={-1}` on the confirmation `h1` and focus it after render (like the step headings).
- **Verification:** E2E asserts the confirmation heading is focused.

#### M-2 · Wrong field focused on the shipping step
- **Location:** `src/lib/commerce.ts` L189–207; `src/pages/Checkout.tsx` L50.
- **Description:** With an invalid postal code and empty country, focus goes to Country, skipping the visually earlier Postal code.
- **Root cause:** Format errors are inserted into the error object after required-field errors, so `Object.keys()` order is not field order.
- **Evidence:** Browser: postal `-`, country empty → focused `country`.
- **Solution:** Focus the first field in the fixed field list that has an error.
- **Verification:** Unit test on the focus helper; E2E for this combination.

#### M-3 · Checkout placeholders look like completed values
- **Location:** `src/pages/Checkout.tsx` L214–234; `src/styles.css` L1530–1533 (`#777c6d`).
- **Description:** Placeholders "Alex", "Sample", "12 Sample Street", "Berlin", "10115" in mid-grey read as pre-filled data, especially on mobile.
- **Solution:** Use lighter placeholders with format hints ("e.g. 10115") or remove name placeholders; keep the "use fictional details" note.
- **Verification:** 5-second usability check; screenshot review.

#### M-4 · Low-contrast text over the hero photograph
- **Location:** `src/pages/Home.tsx` L55–65; `src/styles.css` L386–403.
- **Description:** "Thoughtfully made. *Simply essential.*" (11px + 25px italic, charcoal) sits directly on textured travertine; barely readable at 1440 and 375.
- **Evidence:** Screenshots; axe reports these nodes as `color-contrast` incomplete (cannot compute over image).
- **Solution:** Remove it, or place it on a solid ivory label/scrim with ≥ 4.5:1 contrast.
- **Verification:** Manual contrast sampling of the rendered background.

#### M-5 · Touch targets below 44 px on mobile
- **Location:** `.favorite-button` (36×38), header icons (35×44), footer links (≈14 px tall) at 375 px; `src/styles.css` L494–500, L1984–1986, footer rules.
- **Evidence:** Bounding-box scan at 375 px.
- **Solution:** Minimum 44×44 hit area (padding or pseudo-element); footer links `display:block; padding-block: 10px`.
- **Verification:** Re-run the bounding-box scan; expect no interactive element < 44 px in either dimension (except inline text links in paragraphs).

#### M-6 · Mobile product page buries price and "Add to bag"
- **Location:** `src/pages/Product.tsx` layout; mobile styles.
- **Description:** At 375×812 the first screen is the image + thumbnails; product name starts at the bottom, price and CTA are about 1.5 screens down. No sticky purchase bar.
- **Solution:** Reduce mobile image height (4:5), show name/price directly under the image, add a sticky bottom "Add to bag — €X" bar after the main CTA scrolls away.
- **Verification:** Screenshot at 375/390: name, price and CTA within the first ~1.2 viewports.

#### M-7 · Wishlist removed from the mobile header
- **Location:** `src/styles.css` (mobile media query sets `.wishlist-link { display: none }`); `src/components/Shell.tsx` L176–185.
- **Description:** On phones the saved-items count is invisible; wishlist is only in the menu, without a count.
- **Solution:** Keep the heart icon with counter on mobile, or show counts in the menu.
- **Verification:** 375 px screenshot shows wishlist count.

#### M-8 · Oversized images for thumbnails and gallery
- **Location:** `src/pages/Product.tsx` L62–76 (thumbnail `src={image.src}`), L31–36 (main image without `srcSet`).
- **Description:** 74×90 thumbnails load the full 960 px product file and the 1600 px `hero.webp` (130 KB). The main PDP image has no `srcSet`/`sizes`.
- **Evidence:** Network: `serum.webp` + `hero.webp` loaded on the PDP; mobile LCP on PDP 2.54 s under throttling (LCP element `IMG serum.webp`).
- **Solution:** Use `-480` variants for thumbnails; `srcSet`/`sizes` + `fetchpriority="high"` on the main image; preload it.
- **Verification:** Network panel: no 1600 px asset on PDP; re-measure LCP.

#### M-9 · Price filter range and semantics don't match the catalog
- **Location:** `src/pages/Shop.tsx` L12–20, L76–85; `src/lib/commerce.ts` L126–144.
- **Description:** Slider runs €18–€70, but the highest base price is €48 — the whole €48–€70 range changes nothing (verified: 12 results at both 48 and 70). The filter uses base price only, while the 50 ml Daily Glow Serum costs €56.
- **Solution:** Derive min/max from the catalog; label "From €X" on cards with multiple sizes, or filter on the lowest variant price explicitly ("Starting price up to").
- **Verification:** Unit tests for derived bounds; slider max equals max price.

#### M-10 · Generic page titles; no per-product title or meta
- **Location:** `src/components/Shell.tsx` L93–99.
- **Description:** Every PDP title is "AURA — The Details"; unknown paths produce titles from the raw URL (e.g. "AURA — Nonexistent"); a missing product also shows "The Details".
- **Solution:** Set the title from the product name (`AURA — Daily Glow Serum`), "Page not found" for 404; per-route meta description.
- **Verification:** E2E asserts `document.title` per route.

#### M-11 · Dev-dependency advisories
- **Location:** `package.json` devDependencies (`vitest ^3.2.4`).
- **Description:** `pnpm audit`: `tinypool` (critical ×2, prototype-pollution → RCE gadgets), `vitest`/`@vitest/mocker` (moderate ×3). Dev/test tooling only; not shipped to browsers.
- **Solution:** Upgrade to a patched Vitest major (≥ 4.1.12 per advisories) in the repair phase and re-run tests.
- **Verification:** `pnpm audit` clean; 36 tests still pass.

#### M-12 · Test-suite blind spots
- **Location:** `e2e/store.spec.ts` L304–335; `playwright.config.ts` (single desktop project).
- **Description:** The committed axe checks run only against **empty** bag/wishlist at 1440 px. No test covers the over-limit merge (H-2), field focus order (M-2), confirmation focus (M-1), font-size floor (C-1), CLS (H-1) or document titles.
- **Solution:** Add a mobile project, populated-state axe checks, and the regressions listed above.
- **Verification:** New tests fail on current code, pass after fixes.

### LOW

| ID | Location | Finding | Solution |
| --- | --- | --- | --- |
| L-1 | `src/lib/commerce.ts` L14–36 | `totals()`/`unitPrice()` are not defensive on their own: quantity 0 or −5 counts as **1**, unknown size is charged the base price, unknown product is €0 (verified by calling the functions). Safe today only because every input passes through `sanitizeStore`/`addItem`. | Make `totals` skip invalid lines (or throw in dev) so the pricing function is safe in isolation. |
| L-2 | `src/lib/commerce.ts` L75–87 | Persisted `quantity: 0.4` becomes 1, `1e9` becomes 10 silently. | Accept only integers 1–10; drop others. |
| L-3 | `src/state/Store.tsx` L112–122 | Wishlist toast reads stale `data.wishlist`; two toggles before re-render show the wrong message. | Derive the message inside the updater or from the result. |
| L-4 | `src/pages/Checkout.tsx` L68 | `crypto.randomUUID()` only exists in secure contexts; opening the dev server via a LAN IP over http would throw on completion (error boundary). | Fallback ID generator. |
| L-5 | `src/pages/Checkout.tsx` L124–139 | Receipt shows only the total (no subtotal/shipping lines); refresh loses it and shows the empty-bag state without explanation. | Mirror the summary lines; optional sessionStorage of the non-personal receipt. |
| L-6 | `src/pages/Shop.tsx` L19, L32–36 | Invalid `sort` URL value displays "Our selection" but still shows "Clear filters". | Whitelist sort values like categories. |
| L-7 | `src/pages/Shop.tsx`, `Wishlist.tsx` | axe best-practice: `heading-order` (h1 → h3 card titles); `region`: announcement bar outside landmarks. | Visually hidden h2 "Products"; wrap announcement in `<aside aria-label>`. |
| L-8 | `src/pages/Wishlist.tsx` L6 | Saved items appear in catalog order, not the order saved; quick-add always uses the smallest size without saying so. | Preserve saved order; label "Add 30 ml". |
| L-9 | `src/pages/Home.tsx` L132–137, `Product.tsx` L22 | `hero.webp` is reused as hero, philosophy image and in every PDP gallery — repetitive. | Add 1–2 editorial images (texture, ritual close-up). |
| L-10 | `src/pages/Home.tsx` L198–203 | 230 px Lucide `Flower2` outline as editorial decoration reads as clip-art against the photography. | Replace with photography, a subtle texture or nothing. |
| L-11 | `src/pages/Home.tsx` L171 | "A few favorites → Explore the collection" links to `?sort=price-desc` — unexpected. | Link to `/shop`. |
| L-12 | Generated imagery | Rendered labels differ from catalog names (e.g. bottle reads "DAILY SERUM" for "Daily Glow Serum"). Disclosed in UI and credits. | Regenerate labels to match names where feasible. |
| L-13 | `src/styles.css`, `package.json` | Tailwind 4 is installed but used only for `@theme`/preflight; 3,071 lines of hand CSS with `!important` overrides. README/portfolio list Tailwind as a featured technology. | Either use Tailwind utilities for layout/tokens or describe it accurately as "Tailwind theme + custom CSS". |
| L-14 | `src/components/UI.tsx` L68–78 | Out-of-stock card keeps a disabled translucent "Currently unavailable" bar over the photo (low contrast); no alternative action. | Replace with a "Save for later" action or a clear badge only. |
| L-15 | `src/components/Shell.tsx` L246–260 | Mobile menu is a centred modal without categories or counts. | Full-height drawer with categories, wishlist/bag counts. |

---

## Phase details and evidence

### Phase 1 — Project inspection
- **Architecture:** Vite 7 + React 19 + TS 5.9 strict, React Router 7 (`/`, `/shop`, `/product/:slug`, `/cart`, `/wishlist`, `/checkout`, `/about`, `/contact`, `*`). Home eager, others `lazy()`. Class `ErrorBoundary` around the shell.
- **State:** single React Context (`src/state/Store.tsx`) with pure helpers in `src/lib/commerce.ts`. One storage key `shopmini-aura-v1`, `{cart, wishlist}` only.
- **Data:** 12 typed products in `src/data/products.ts`, 3 per category, 1 out of stock (Stillness Body Oil), size variants with integer-cent surcharges.
- **Dependencies:** 6 runtime (React, React DOM, Router, Lucide, two Fontsource packages). No Zustand/Motion — acceptable per brief ("where justified").
- **Tests:** 32 commerce unit tests, 2 store tests, 2 contact tests; 22 Playwright scenarios.
- **Git:** independent repo, 2 commits, clean.
- **Requirement match:** all 8 pages and all listed interactions exist. Gaps vs. brief: "large product photography / thumbnail gallery" is padded (H-3); "excellent mobile usability / readable typography" not met (C-1, M-5, M-6).

### Phase 2 — Premium UI/UX (creative-director view)
- **Strong:** palette exactly per brief; Cormorant/Manrope pairing; restrained layout; photography is the best asset — consistent light, surface and vessel family; all 12 products look like one brand. Hero composition at 1440 is genuinely editorial.
- **Weak / cheap signals:** microscopic UI type everywhere (C-1); label over hero photo (M-4); fake gallery (H-3); hero image recycled three times (L-9); clip-art flower (L-10); the always-visible translucent "Add to bag" bar covers the lower third of every product photo; two cleanser bottles and two amber droppers are near-identical silhouettes, which reduces catalog variety; footer copy at 10px.
- **Copy:** tasteful, but heavy repetition of "little", "ritual", "everyday", "considered" — reads templated/AI-generated after a few pages.

### Phase 3 — Catalog (verified in browser + module calls)
12 cards; 12 unique IDs and slugs; all 24 product images load (960×1440 and 480×720); EUR formatting `€28.00`, `€1,234.56`; categories correct. Combined URL filters verified: Serums + ≤€45 + "serum" + price-desc → Daily Glow, Dew Drop (correct order, count "2 essentials"). `search=cream` + price-desc correct. Cleansers + "serum" → empty state with reset. Invalid params (`category=Bogus`, `maxPrice=abc`, `sort=evil`, HTML in search) fall back safely; HTML rendered as text (no injected `<img>`). Unknown slug → "An essential we couldn't find." Issues: M-9, L-6.

### Phase 4 — Product details
Variant radios update price; quantity cannot go below 1 or above 10 (buttons disabled); out-of-stock product has disabled CTA; accordions native `<details>`; related products correct. Issues: H-2, H-3, M-6, M-8, M-10.

### Phase 5 — Cart (critical)
Independent expected values (integer cents) all matched:

| Scenario | Expected | Actual |
| --- | --- | --- |
| Cleanser 150 ml ×1 | 2800 + 490 = 3290 | 3290 |
| Serum 50 ml + Hand cream 75 ml | 7400 + 490 = 7890 | 7890 |
| Lotion 250 ml + Night serum 30 ml | 8000, free | 8000 |
| Corrupted storage (injected `priceCents:1`, invalid size, negative qty, string qty, out-of-stock, unknown size) | Only valid lines: 2×€28 + 1×€38 = €94.00, free shipping | €94.00, free; injected price ignored |
| Wishlist → add Face Cream twice, +1 in bag, refresh | 3 × €38 = €114.00, persisted | €114.00 after reload |

No floating-point arithmetic on money (all cents; formatting only divides at display). Persisted prices are never trusted. Malformed JSON and unavailable storage are covered by unit tests. Risks: H-2 (silent cap), L-1/L-2 (latent validation looseness).

### Phase 6 — Wishlist
Toggle from card and PDP stays in sync with header count and wishlist page; duplicates removed on load; out-of-stock items can be saved but not added; persisted across reload; empty state present. Issues: M-7, L-3, L-8.

### Phase 7 — Checkout (critical)
- Empty submit → 3 errors, focus on First name, `aria-invalid`, `role="alert"`.
- Whitespace-only name rejected; `alex@example` rejected; Enter submits.
- Postal `-` rejected; country required; only listed countries accepted.
- Review matches cart line by line; Edit buttons return to steps; totals identical to the bag (`totals()` shared).
- Double-click on "Complete demo order" → one receipt (`DEMO-128F3184`), bag cleared, wishlist kept, storage contains only `{cart:[],wishlist:[…]}`; sessionStorage empty.
- Network during the flow: only same-origin GET requests; no POST, no third-party host.
- No card fields anywhere; demo disclaimers on banner, review note and confirmation.
- Direct `/checkout` with an empty bag shows an empty state (cannot confirm an empty order).
- Issues: M-1, M-2, M-3, C-1 (labels/errors 10px, inputs 12px on mobile), L-4, L-5.

### Phase 8 — Responsive
Manual screenshots at 375, 768, 1024, 1440, 1920; Playwright overflow check at all six widths. No horizontal overflow on any route, no broken images, no runtime errors. Grids adapt (4 → 2 columns). Issues: C-1, M-5, M-6, M-7, L-15. At 1920 the hero is boxed rather than full-bleed — acceptable.

### Phase 9 — Accessibility
Good: skip link, focus moved to `<main>` on route change, native `<dialog>` with Escape and focus restore (verified), `:focus-visible` 2px outline, labelled inputs, `aria-pressed` toggles, live status for result count and toast, `prefers-reduced-motion` handling, descriptive alt text. Gaps: C-1, M-1, M-2, M-4, M-5, L-7. axe passes, but axe does not measure font size or touch targets.

### Phase 10 — Performance (measured, production preview, Edge)

| Profile | Route | FCP | LCP (element) | CLS | Transfer |
| --- | --- | --- | --- | --- | --- |
| Desktop 1440, unthrottled | / | 364 ms | 396 ms (hero.webp) | 0.001 | 458 KB |
| Desktop 1440, unthrottled | /shop | 136 ms | 452 ms | **0.317** | 397 KB |
| Desktop 1440, unthrottled | /product/daily-glow-serum | 144 ms | 460 ms | **0.289** | 442 KB |
| Mobile 375, 4× CPU, ~1.6 Mbps | / | 1464 ms | 1464 ms (H1) | 0.064 | 504 KB |
| Mobile 375, 4× CPU, ~1.6 Mbps | /shop | 1208 ms | 1872 ms | **0.282** | 397 KB |
| Mobile 375, 4× CPU, ~1.6 Mbps | /product/daily-glow-serum | 1228 ms | 2544 ms (serum.webp) | **0.281** | 442 KB |

Local loopback measurements (not field data, not Lighthouse). Bundle is small; fonts self-hosted (5 WOFF2 files, no preload). Most impactful: fix CLS (H-1), right-size PDP images (M-8), preload the LCP image and the two primary font files.

### Phase 11 — Security & data
User input rendered via React text nodes only (no `dangerouslySetInnerHTML`); URL params validated; no secrets; no external requests at runtime; checkout data kept in component state only and cleared. Storage validated per record. **Frontend validation provides no payment or order security** — a real store needs server-side price/stock validation, authenticated orders and a PCI-compliant payment provider. Dev-only advisories: M-11.

### Phase 12 — Automated testing and journeys

| Journey | How verified | Result |
| --- | --- | --- |
| 01 Browse → details → bag → checkout | E2E #3/#4 + manual | Pass |
| 02 Search → filter → sort → product | E2E #2 + manual URL combinations | Pass |
| 03 Wishlist → bag → adjust quantity | Manual (production preview) | Pass |
| 04 Refresh restores bag and wishlist | E2E #3/#7 + manual reload | Pass |
| 05 Invalid checkout → errors → fix → demo confirmation | E2E #4 + manual keyboard run | Pass, with M-1/M-2 |
| 06 Mobile nav → browse → bag → checkout | E2E #5 + manual at 375 | Pass |

Passed: 36 unit, 22 E2E, 12 extra axe scans. Failed: 0. Skipped: 0. Untested: Safari/iOS (input zoom inferred from 12px font size, not observed), Firefox, physical devices, screen readers, Lighthouse.

---

## Phase 13 — Scores

| Area | Score | Reason |
| --- | --- | --- |
| Visual Design | **6/10** | Strong palette, photography and editorial layout, undermined by 5–11px type, low-contrast overlay text, recycled hero and a padded gallery. |
| Brand Consistency | **8/10** | All 12 products share surface, light, vessel family and wordmark; minor label/name mismatches and repetitive copy. |
| Product Catalog | **8/10** | Correct data, combined URL filters, safe fallbacks, empty state. Price slider dead range and base-price semantics. |
| Product Detail Experience | **6/10** | Variants, quantity, stock and accordions work; fake gallery, silent cap, generic titles, CTA buried on mobile. |
| Shopping Cart Reliability | **8.5/10** | Exact integer-cent totals, untrusted prices ignored, robust sanitization, persistence verified. Silent cap and latent `totals()` leniency. |
| Checkout Experience | **7.5/10** | Honest, private, validated, duplicate-safe, review matches the bag. Focus-order bug, unannounced confirmation, placeholder confusion, tiny labels/errors. |
| Responsive Design | **6.5/10** | No overflow at any width; but phone readability, small targets, hidden wishlist and long PDP scroll. |
| Accessibility | **6.5/10** | Solid semantics, dialogs, focus management, zero axe violations; tiny text, sub-44px targets, overlay contrast, confirmation focus. |
| Performance | **7/10** | Small route-split bundle, fast LCP; poor CLS on lazy routes and oversized PDP images. |
| Security & Data Handling | **8.5/10** | No transmission, no XSS paths, validated storage, clear demo framing; dev-only advisories. |
| Code Quality | **7.5/10** | Clean pure commerce module, strict TS, meaningful tests. Very dense formatting, duplicated validation in `add`/`addItem`, Tailwind nearly unused, 3k-line CSS with magic numbers and `!important`. |
| Upwork Portfolio Readiness | **6.5/10** | Technically convincing; visually not yet — the typography is the first thing a client notices. |

---

## C. Visual improvements (highest value first)
1. Type scale with 14–16px body/meta, 16px inputs, 12px minimum for tracked eyebrows (C-1).
2. Real secondary images per product, or a single strong image without fake controls (H-3).
3. Remove or back the hero overlay label with a solid surface (M-4).
4. Make quick-add appear on hover/focus on desktop and as a compact icon button on mobile, so photography is not covered.
5. Mobile PDP: shorter image, name/price immediately below, sticky add-to-bag bar (M-6).
6. Two or three additional editorial images to replace hero repetition; drop the clip-art flower (L-9, L-10).
7. Tighten copy: fewer "little/ritual/considered"; more concrete product detail (size, texture, use time).
8. Show "From €X" on multi-size cards; small size chips on cards.

## D. Functional improvements
1. Report accepted quantity on merge; cap the PDP selector by what is already in the bag (H-2).
2. Fix CLS (H-1).
3. Focus the first invalid field in visual order; focus the confirmation heading (M-2, M-1).
4. Derive price slider bounds from data; clarify base-price filtering (M-9).
5. Per-product document titles and 404 title (M-10).
6. Make `totals()` and sanitization strict (integer 1–10 only; skip invalid lines) (L-1, L-2).
7. Receipt with subtotal/shipping lines (L-5); randomUUID fallback (L-4).
8. Tests for each of the above, populated/mobile axe checks, font-size floor check (M-12); upgrade Vitest (M-11).

## E. Repair plan

**Phase 1 — Critical and High**
1. C-1 type scale (styles.css tokens; verify with font-size floor script at 375/1440).
2. H-1 CLS (Suspense fallback / footer placement; re-measure).
3. H-2 quantity merge feedback + PDP cap (store + tests).
4. H-3 gallery decision (new assets or single-image layout).

**Phase 2 — Medium functionality**
M-1, M-2, M-3, M-9, M-10, M-11, M-12, L-1, L-2.

**Phase 3 — High-value visual and UX**
M-4, M-5, M-6, M-7, M-8, quick-add presentation, editorial imagery (L-9, L-10), copy pass.

**Phase 4 — Low priority**
L-3 … L-8, L-11 … L-15; update README/PORTFOLIO/TEST_REPORT to match the final state (including the accurate Tailwind description).

---

## Phase 15 — Final portfolio verdict
1. **Premium look?** Partly. Photography, palette and composition are premium; the micro-typography and padded gallery are not.
2. **Shopping works reliably?** Yes. No functional failure found in catalog, bag, wishlist or checkout; one misleading quantity message.
3. **Cart calculations accurate?** Yes, verified against independent integer-cent expectations, including corrupted storage.
4. **Demo checkout correct?** Yes: validated, private, no network submission, cannot confirm an empty bag, truthful confirmation. Accessibility polish needed.
5. **Mobile professional?** Not yet: layout holds, but text is too small, targets are tight and the PDP buries the CTA.
6. **Would it convince an Upwork client?** A technical client reading the code: likely yes. A small-business owner opening it on a laptop or phone: likely hesitant because of legibility.
7. **Five most important improvements:** (1) type scale, (2) CLS fix, (3) real or simplified gallery, (4) quantity-merge feedback, (5) mobile PDP layout and touch targets.
8. **Ready for public portfolio use?** **Not yet.** After Phase 1 and the mobile items in Phase 3, yes.
