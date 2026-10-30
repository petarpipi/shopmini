# Upwork Portfolio — ShopMini / AURA

## Portfolio title

Premium Skincare E-commerce Store | React, TypeScript & Responsive Design

## Professional description

ShopMini is a polished e-commerce frontend built around AURA, an original fictional skincare brand. The project pairs a warm editorial identity with a complete shopping journey: discover a collection, find products with search and filters, choose sizes, save favorites, manage a persistent bag, and complete a clearly labeled demonstration checkout.

The application demonstrates practical frontend work that small businesses commonly need: consistent product presentation, mobile navigation, accurate pricing, accessible forms, useful empty states, and reliable client-side state. Its compact architecture keeps product content separate from business rules and reusable UI components, making it straightforward to audit and adapt.

## Demonstrated features

- Eight responsive pages with a cohesive luxury visual language.
- A 12-product catalog with four categories and size-dependent pricing.
- Search, category filters, a minimum–maximum price range, alphabetical and price sorting, all URL-backed.
- Product pages with size cards, accordions, wishlist toggles, stock-aware purchase controls, per-size quantity limits with honest feedback, and a compact mobile purchase bar.
- Persistent bag and wishlist with safe validation and size-aware line items.
- Integer-cent totals and an explicit simulated shipping threshold.
- Multi-step checkout with customer/shipping validation, editing and a local receipt.
- Contact/newsletter forms with honest local-only success states.
- Native dialogs, keyboard navigation, visible focus, and reduced-motion handling.
- Automated business-logic, component, browser, responsive, and accessibility tests.
- Local optimized imagery, self-hosted fonts, and route splitting.

## Technologies

React, TypeScript, Vite, React Router, React Context, Lucide React, custom CSS design tokens (with the Tailwind CSS theme layer), Vitest, React Testing Library, Playwright, and axe-core.

## Problems solved

| Practical challenge | Implementation |
| --- | --- |
| A store should look coherent across pages | Shared design tokens, typography, navigation, controls, and product cards |
| Shoppers need to find the right product | Composable URL-backed search, category, price and sorting controls |
| Different sizes must remain distinct | Cart identity combines product ID and variant name |
| Totals must remain reliable | Prices and calculations use integer cents; quantities are bounded |
| Refresh should not lose a shopping session | Validated namespaced LocalStorage with preservation of valid records |
| A demo should not mislead visitors | Clear fictional-brand, generated-image and no-purchase disclosures |
| Mobile checkout should remain usable | 16px single-column fields, an error summary linked to fields, focus on the first invalid field, and a focused confirmation heading |
| Shoppers should never be told something false | Quantity merges report how many units were really added at the 10-per-size limit |
| Small text makes a premium design look unfinished | A tokenised type scale, checked by an automated 12px floor test on every route |
| Implementation needs independent review | Typed modules, meaningful tests, evidence and a dedicated audit handoff |

## Suggested Upwork caption

Designed and developed a premium skincare concept store with React and TypeScript. Features include a searchable product catalog, filters, size selection, a persistent shopping bag and wishlist, and a validated multi-step demo checkout. Responsive layouts and automated tests support the complete shopping experience.

## Portfolio presentation

Use the homepage desktop image first, followed by the desktop product page, the mobile product page with its purchase bar, the mobile bag and the demo confirmation. Full-page screenshots demonstrate consistency across the entire experience. Screenshots are authentic captures from the local app; see `qa/screenshots/`.

## Demonstration limitations

This is an independently created portfolio concept, not commissioned client work. AURA is not a real business. There are no real orders, payments, customer messages, sales results, certifications, reviews, clinical claims, or business achievements. Photography is generated specifically for the concept. Inventory and shipping are simulated, and there is no backend or account system. No production performance score is claimed.
