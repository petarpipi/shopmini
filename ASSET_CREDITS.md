# Asset Credits and Provenance

## Product and campaign imagery

All 13 source images were generated specifically for this fictional AURA concept with the built-in OpenAI image generation tool on the task date, 2026-10-25. They are actual local raster assets, not remote URLs or nonexistent placeholders. There are no downloaded stock photographs, third-party product photographs, watermarks, or real-person images.

| Local base filename | Role |
| --- | --- |
| `hero.webp` | Campaign hero, collection still life and editorial sections |
| `cleanser.webp` | Gentle Milk Cleanser |
| `serum.webp` | Daily Glow Serum |
| `moisturizer.webp` | Essential Face Cream |
| `body.webp` | Botanical Body Lotion |
| `soft-foam-cleanser.webp` | Soft Foam Cleanser |
| `evening-cleansing-oil.webp` | Evening Cleansing Oil |
| `quiet-night-serum.webp` | Quiet Night Serum |
| `dew-drop-serum.webp` | Dew Drop Serum |
| `velvet-night-cream.webp` | Velvet Night Cream |
| `cloud-light-moisturizer.webp` | Cloud Light Moisturizer |
| `linen-hand-cream.webp` | Linen Hand Cream |
| `stillness-body-oil.webp` | Stillness Body Oil |

Files are stored in `public/images/`. Product files have 960px and `-480.webp` 480px versions. The hero has 1600px and `hero-800.webp` versions. Sharp was used only to resize and encode the existing generated images as WebP. `asset-generation.json` records every final prompt, reference category, original generated filename and source directory. `scripts/prepare-assets.cjs` documents the conversion process. The distributed site needs only the included WebP files, not the original generator output directory or Sharp.

The applicable provider terms describe rights in generated output: [OpenAI Terms of Use — Content](https://openai.com/policies/terms-of-use/), [OpenAI Service Terms](https://openai.com/policies/service-terms/). These are generated outputs, not stock assets offered under a Creative Commons or public-domain license. No exclusivity or unique trademark ownership is asserted.

**Visual limitations:** These are AI-created packaging visualizations of fictional products, not photographs of manufactured skincare. Each catalog product has a distinct image, but exact small label text, vessel details and volumes may differ from the structured catalog. Product pages show the single image that exists for each product; the earlier three-slot gallery (which repeated the product image and the shared hero) was removed rather than padded with fake variations. The brand and catalog are fictional. UI and documentation disclose this.

**Assets that do not exist (and would be needed for a multi-image gallery):** for each of the 12 products, a texture/swatch close-up, a back-label or detail angle, an in-hand or scale shot, and size-specific packshots for the larger variant (11 products have two sizes; Stillness Body Oil has one). The site also has only one editorial lifestyle image (`hero.webp`), reused for the homepage hero, the philosophy section and the About banner. No unrelated or unlicensed stock images were substituted.

**Consistency review (2026-10-26):** all 12 product files are 960 × 1440 (2:3) with matching 480 × 720 versions, the same travertine surface, warm side light and shared AURA wordmark. Cards crop them to 4:5 and product pages to 4:5 (desktop) or 1:1 (mobile). Known differences: the three Body Care images include stone and olive-branch props while the other nine do not; Gentle Milk Cleanser and Soft Foam Cleanser use near-identical bottles; small label text differs from some product names (for example, “Daily Serum” on Daily Glow Serum).

## Fonts

Fonts are bundled and self-hosted through Fontsource packages. No Google Fonts CDN or third-party font request occurs at runtime.

| Font | Source | License | Included notice |
| --- | --- | --- | --- |
| Manrope | [Fontsource / Manrope](https://fontsource.org/fonts/manrope/about), [upstream project](https://github.com/googlefonts/manrope) | SIL Open Font License 1.1 | `public/licenses/manrope-OFL.txt` |
| Cormorant Garamond | [Fontsource / Cormorant Garamond](https://fontsource.org/fonts/cormorant-garamond), [upstream project](https://github.com/CatharsisFonts/Cormorant) | SIL Open Font License 1.1 | `public/licenses/cormorant-garamond-OFL.txt` |

Manrope is credited to the Manrope Project Authors, including Mikhail Sharanda. Cormorant is credited to its upstream authors through the full bundled license. License files were copied from the installed packages without modification.

## Icons

Lucide React supplies interface icons. [Lucide license](https://lucide.dev/license): ISC, including the upstream attribution for Feather-derived portions. The complete package notice is included at `public/licenses/lucide-ISC.txt`.

The AURA wordmark is live text using the licensed Cormorant font. The simple letter-A favicon was authored for this project. Neither is presented as an exclusive registered trademark.

## Copy and source

All brand, product, editorial, and portfolio copy was created for this project. No testimonials, sales metrics, real customer identities, certifications, clinical claims, or copied brand stories are included. “Editor’s selection” and concept bestseller language describe an editorial demonstration, not observed sales rankings.

Open-source dependency notices remain available in installed packages and the lockfile. This document credits the visible third-party assets and the generated imagery; it does not replace their license terms.
