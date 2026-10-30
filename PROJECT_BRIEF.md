# PROJECT 05 — SHOPMINI
## Premium E-commerce Web Application

# YOUR ROLE

You are an autonomous professional e-commerce development team consisting of:

1. Senior Product Designer
2. Creative Director
3. Senior React Developer
4. TypeScript Engineer
5. E-commerce UX Specialist
6. Frontend Architect
7. Accessibility Engineer
8. Performance Engineer
9. QA Automation Engineer

Your mission is to design and implement SHOPMINI, a premium, fully interactive e-commerce frontend for my professional Upwork portfolio.

This is the fifth and final project in my five-project portfolio series.

The website must demonstrate that I can build modern, polished, functional online stores for small and medium-sized businesses.

My Upwork target is initially small freelance projects ranging from $20 to $150.

Create a professional portfolio piece that demonstrates practical e-commerce development skills.

Communicate exclusively in Macedonian.

Website content, code, documentation, and variable names must be in English.

---

# 1. IMPORTANT — PARALLEL DEVELOPMENT

Another Codex agent is currently developing PROJECT 04 — MOTIONCRAFT V2.

You must work independently.

Your project directory is:

`05-shopmini`

STRICT RULES:

- Never modify `01-fixlab`.
- Never modify `02-pixelperfect`.
- Never modify `03-luxe`.
- Never modify `04-motioncraft`.
- Never change shared workspace configuration unless absolutely required and explicitly approved.
- Do not stop or interfere with the other Codex agent.
- Do not run repository-wide formatting or cleanup commands.
- Do not stage all repository changes using `git add .` or `git add -A`.
- Do not create commits in a shared working tree while another agent is modifying it.

If the current workspace is a shared Git repository, prefer creating an independent Git worktree or another safe isolated working directory for ShopMini.

Ensure each agent has its own working tree before concurrent modifications.

If isolation cannot be established safely, stop and explain the smallest necessary setup step.

Do not overwrite unrelated files.

---

# 2. TECHNOLOGY STACK

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Motion for React where justified
- Zustand or React Context for cart state
- Vitest
- React Testing Library
- Playwright

Avoid unnecessary dependencies.

Choose simple, maintainable architecture.

Use reusable components and properly typed data models.

---

# 3. BRAND CONCEPT

Brand name: AURA

Application project name: ShopMini

Industry: Premium skincare and self-care products.

Brand personality:

- Elegant
- Modern
- Minimalist
- Sophisticated
- Warm
- Trustworthy

Target audience:

People interested in premium skincare, wellness and minimalist beauty products.

This is a fictional brand created specifically for demonstration purposes.

Do not invent real customer testimonials, certifications, awards or clinical claims.

---

# 4. VISUAL DESIGN

Create a distinctive luxury e-commerce experience.

Style:

Premium editorial minimalism with contemporary European visual design.

Color palette:

- Ivory: #F8F6F2
- Cream: #EFEAE2
- Warm white: #FFFFFF
- Charcoal: #252723
- Muted sage: #909B86
- Warm taupe: #B5A99A

Typography:

- Manrope for body text and interface
- Cormorant Garamond for premium editorial headings

Design principles:

1. Large, high-quality product photography.
2. Clean editorial typography.
3. Strong visual hierarchy.
4. Generous whitespace.
5. Perfect alignment.
6. Consistent product cards.
7. Refined micro-interactions.
8. Clear shopping navigation.
9. Minimal distractions.
10. Excellent mobile usability.

Avoid generic SaaS styling, excessive gradients, glassmorphism, oversized rounded cards and unnecessary visual effects.

The website must feel like a genuine premium e-commerce brand.

---

# 5. WEBSITE PAGES

Build a complete functional application with the following pages.

## PAGE 01 — HOME

Create a premium homepage.

Sections:

1. Announcement bar
2. Navigation
3. Editorial hero
4. Featured products
5. Shop by category
6. Brand philosophy
7. Bestsellers
8. Editorial storytelling
9. Newsletter demo form
10. Footer

Hero headline:

"Rituals for
Everyday Living."

Subtitle:

"Thoughtfully formulated essentials for your daily moments of care."

CTA:

"Explore Collection"

Use refined imagery and intentional composition.

## PAGE 02 — SHOP / PRODUCT CATALOG

Create a fully functional product catalog.

Display 12 fictional skincare products.

Categories:

- Cleansers
- Serums
- Moisturizers
- Body Care

Include:

- Product images
- Product names
- Product descriptions
- EUR prices
- Category labels
- Availability
- Favorite button
- Add to Cart button

Implement functional:

- Search
- Category filters
- Price filtering
- Sorting by price
- Sorting by name
- Clear filters
- Empty results state

Filters must update the displayed products correctly.

## PAGE 03 — PRODUCT DETAILS

Create a professional product detail page.

Include:

- Large product image
- Thumbnail gallery
- Product name
- Description
- Price
- Product size or variant
- Quantity selector
- Availability
- Add to Cart
- Add to Wishlist
- Product information accordion
- Related products

All controls must work.

Do not invent medical or clinically proven product benefits.

## PAGE 04 — SHOPPING CART

Implement a functional shopping cart.

Include:

- Product image
- Product name
- Selected variant
- Unit price
- Quantity controls
- Remove item
- Subtotal
- Estimated shipping
- Total
- Continue Shopping
- Proceed to Checkout

Cart totals must update automatically.

Prevent negative quantities and invalid amounts.

Persist cart state in LocalStorage.

Provide a clear empty-cart experience.

## PAGE 05 — WISHLIST

Create a dedicated Wishlist page.

Functionality:

- Add favorite products
- Remove favorite products
- View saved products
- Add saved products to cart
- Preserve wishlist between browser refreshes

Use LocalStorage.

## PAGE 06 — DEMO CHECKOUT

Create a polished multi-step checkout.

Steps:

1. Customer information
2. Shipping details
3. Order review
4. Demo order confirmation

Fields:

- First name
- Last name
- Email
- Address
- City
- Postal code
- Country

Validate required fields.

Implement accurate order totals.

Do not integrate Stripe, PayPal or real payment processing.

Clearly indicate that checkout is a demonstration and no actual purchase or payment occurs.

Never collect real card numbers.

Do not transmit customer information to external services.

Do not pretend orders have been submitted to a real business.

## PAGE 07 — ABOUT

Create an editorial brand story.

Use original, refined copy.

Include:

- Brand philosophy
- Product design values
- Materials and packaging concept
- Premium editorial visuals

Keep all claims fictional and clearly part of a concept brand.

## PAGE 08 — CONTACT

Build a clean contact page.

Include:

- Name
- Email
- Subject
- Message
- Functional client-side validation
- Demonstration success state

Clearly label the form as a demonstration.

Do not claim messages have actually been delivered.

---

# 6. PRODUCT DATA

Create 12 realistic fictional products.

Each must have:

- Unique ID
- Name
- Category
- Price in EUR
- Description
- Image
- Available variants
- Stock status
- Relevant details

Store product data locally in a structured TypeScript file.

Use precise currency formatting.

Do not rely on a backend.

---

# 7. PRODUCT PHOTOGRAPHY

Visual quality is essential.

Use consistent premium product photography.

Photography direction:

- Minimal skincare packaging
- Neutral backgrounds
- Soft natural lighting
- Consistent shadows
- Clean studio composition
- Refined editorial scenes

Avoid:

- Watermarked images
- Low-quality stock photographs
- Inconsistent packaging
- Distorted product images
- Broken image links

Use legally reusable images, and document their sources and licenses.

If exact visual consistency cannot be achieved with available photography, clearly identify the limitation instead of misrepresenting products.

Do not invent product photography assets that do not exist.

---

# 8. INTERACTIONS

All visible controls must function.

Implement:

1. Add to Cart
2. Remove from Cart
3. Quantity adjustment
4. Wishlist toggle
5. Search
6. Filters
7. Sorting
8. Product gallery
9. Product variant selection
10. Checkout navigation
11. Form validation
12. Cart counter
13. Toast notifications
14. Responsive mobile menu
15. Back-to-top

Add subtle, elegant animations.

Use animation only when it enhances usability or visual quality.

---

# 9. STATE MANAGEMENT

Implement reliable state management.

Requirements:

- Cart state
- Wishlist state
- Product selection
- Product filtering
- Checkout state
- Persistence

Use LocalStorage safely.

Handle invalid stored data without crashing or silently deleting unrelated valid information.

Keep the architecture simple.

Avoid unnecessary global state complexity.

---

# 10. RESPONSIVE DESIGN

Test:

- 375px
- 390px
- 768px
- 1024px
- 1440px
- 1920px

Desktop:
- Editorial layouts
- Elegant product grids
- Spacious navigation

Tablet:
- Adaptive grids
- Optimized spacing

Mobile:
- Functional mobile navigation
- Readable typography
- Touch-friendly buttons
- Clean cart experience
- Usable checkout forms

No unintended horizontal overflow.

---

# 11. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible form fields
- Appropriate ARIA attributes
- Accessible dialogs
- Image alt text
- Reduced-motion support
- Sufficient color contrast

Verify important interactions with keyboard navigation.

---

# 12. PERFORMANCE

Optimize:

- Image loading
- Responsive image sizes
- JavaScript bundle
- Route splitting where useful
- State updates
- Component rendering
- Animation performance
- Font loading

Use lazy loading for non-critical resources.

Avoid layout shifts.

Do not claim measured performance targets unless actual measurements exist.

---

# 13. TESTING

Implement meaningful automated tests.

Unit tests:

- Cart calculations
- Quantity validation
- Product filters
- Price sorting
- Wishlist state
- LocalStorage persistence
- Checkout validation

E2E tests:

- Browse products
- Search for a product
- Filter by category
- Open product details
- Add product to cart
- Change quantity
- Remove product
- Add to wishlist
- Complete demo checkout
- Navigate on mobile

Run:

- TypeScript checks
- Production build
- Unit tests
- E2E tests
- Accessibility checks where available

Fix actual defects.

Never fabricate test results.

---

# 14. PORTFOLIO DOCUMENTATION

Create:

README.md

Include:
- Application overview
- Technology stack
- Installation instructions
- Development commands
- Production build
- Testing instructions

PORTFOLIO.md

Include:
- Upwork portfolio title
- Professional project description
- Features
- Technologies
- Problems solved
- Demonstration limitations

TEST_REPORT.md

Document:
- Tests performed
- Passed tests
- Failed tests
- Known limitations

ASSET_CREDITS.md

Document third-party images, fonts, icons and their licenses.

Prepare screenshots suitable for a professional portfolio.

Do not invent customer achievements, reviews or sales statistics.

---

# 15. GIT & SAFETY

Keep this project completely isolated from MotionCraft and the other portfolio projects.

Do not interfere with the concurrent Codex agent.

Before starting:

1. Inspect the workspace.
2. Check for concurrent work.
3. Confirm safe directory isolation.
4. Use a separate Git worktree if required.
5. Avoid shared Git index operations.

Do not modify unrelated files.

Do not deploy to Vercel.

Do not push to GitHub.

Create a local Git checkpoint only when it is safe and isolated from concurrent work.

---

# 16. FINAL DELIVERY

When complete:

1. Provide the exact local folder path.
2. Start the development server if possible.
3. Give me the exact localhost URL.
4. Summarize all implemented features.
5. Report actual test results.
6. Confirm the other portfolio projects remain unchanged.
7. Prepare desktop and mobile screenshots.
8. Prepare the project for independent Claude Code auditing.

Do not deploy anything.

Do not modify Project 04.

---

# EXECUTION

Work autonomously through all phases:

PHASE 1 — Workspace inspection and isolation

PHASE 2 — Design system and architecture

PHASE 3 — Page implementation

PHASE 4 — E-commerce functionality

PHASE 5 — Responsive design

PHASE 6 — Testing

PHASE 7 — Portfolio documentation

PHASE 8 — Safe local checkpoint

Do not stop after planning.

Do not ask unnecessary questions.

Communicate in Macedonian.

START PROJECT 05 — SHOPMINI NOW.