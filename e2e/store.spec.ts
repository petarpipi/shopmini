import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("editorial links reach their sections and back-to-top respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "A note on thoughtful living" }).click();
  await expect(page).toHaveURL(/about#rituals$/);
  await expect.poll(async () => {
    const bounds = await page.locator("#rituals").boundingBox();
    return bounds !== null && bounds.y >= 0 && bounds.y < 200;
  }).toBe(true);
  await page.getByRole("link", { name: "Design & packaging" }).click();
  await expect(page).toHaveURL(/about#packaging$/);
  await expect.poll(async () => {
    const bounds = await page.locator("#packaging").boundingBox();
    return bounds !== null && bounds.y >= 0 && bounds.y < 200;
  }).toBe(true);
  await page.getByRole("button", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test("browse, search, combine filters, sort and recover from empty results", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Explore Collection", exact: true })
    .click();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  await page
    .getByRole("searchbox", { name: "Search collection" })
    .fill("daily glow");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "Search collection" }).fill("");
  await page.getByRole("button", { name: "Serums", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(3);
  await page
    .getByRole("combobox", { name: "Sort by" })
    .selectOption("price-asc");
  await expect(page.getByTestId("product-card").first()).toContainText(
    "Dew Drop Serum",
  );
  await page.getByRole("slider", { name: "Maximum price in euros" }).fill("40");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await page
    .getByRole("searchbox", { name: "Search collection" })
    .fill("no such item");
  await expect(
    page.getByRole("heading", { name: "A little too specific." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  await page.reload();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});
test("product image, variants, quantity, persisted wishlist and cart totals", async ({
  page,
}) => {
  await page.goto("/product/daily-glow-serum");
  await expect(page).toHaveTitle("Daily Glow Serum — AURA");
  // One honest product image: no duplicated thumbnails pretending to be a gallery.
  const productImages = page.locator(".product-figure img");
  await expect(productImages).toHaveCount(1);
  await expect(page.getByRole("button", { name: /product image/i })).toHaveCount(0);
  await expect(page.locator(".detail-price")).toContainText("€42.00");
  await page.getByRole("radio", { name: "50 ml" }).check();
  await expect(page.locator(".detail-price")).toContainText("€56.00");
  await page
    .getByRole("button", { name: "Increase quantity", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save to your wishlist", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add to bag — €112.00", exact: true })
    .click();
  await page.goto("/cart");
  await expect(page.getByTestId("subtotal")).toHaveText("€112.00");
  await expect(page.getByTestId("shipping")).toHaveText("Complimentary");
  await page
    .getByRole("button", { name: /Decrease quantity for Daily Glow Serum/i })
    .click();
  await expect(page.getByTestId("total")).toHaveText("€60.90");
  await page.reload();
  await expect(page.getByTestId("subtotal")).toHaveText("€56.00");
  await page.goto("/wishlist");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Add Daily Glow Serum, 30 ml, to bag" })
    .click();
  await expect(page.getByRole("status").filter({ hasText: "added to your bag" })).toContainText(
    "Daily Glow Serum, 30 ml added to your bag",
  );
  await page.goto("/cart");
  await expect(page.locator(".cart-item")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Remove Daily Glow Serum 50 ml from bag" })
    .click();
  await page
    .getByRole("button", { name: "Remove Daily Glow Serum 30 ml from bag" })
    .click();
  await expect(
    page.getByRole("heading", { name: "A little space for something lovely." }),
  ).toBeVisible();
  await page.goto("/wishlist");
  await page
    .getByRole("button", { name: "Remove Daily Glow Serum from wishlist" })
    .click();
  await expect(
    page.getByRole("heading", { name: "For a little later." }),
  ).toBeVisible();
});
test("complete a validated demo order without submitting customer data", async ({
  page,
}) => {
  const transmitted: string[] = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") transmitted.push(request.url());
  });
  await page.goto("/product/gentle-milk-cleanser");
  await page.getByRole("button", { name: "Add to bag — €28.00" }).click();
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Continue to shipping" }).click();
  await expect(page.getByLabel("First name")).toBeFocused();
  await expect(page.locator(".field-error")).toHaveCount(3);
  await expect(page.getByRole("alert")).toContainText("Please check 3 fields");
  await page.getByLabel("First name").fill("Alex");
  await page.getByLabel("Last name").fill("Sample");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("alex@example.com");
  await page.getByRole("button", { name: "Continue to shipping" }).click();
  await page.getByRole("button", { name: "Review your order" }).click();
  await expect(page.getByLabel("Street address")).toBeFocused();
  await page.getByLabel("Street address").fill("12 Sample Street");
  await page.getByRole("textbox", { name: "City", exact: true }).fill("Berlin");
  await page.getByLabel("Postal code").fill("10115");
  await page
    .getByRole("combobox", { name: "Country", exact: true })
    .selectOption("Germany");
  await page.getByRole("button", { name: "Review your order" }).click();
  await expect(page.getByTestId("total")).toHaveText("€32.90");
  await page.getByRole("button", { name: "Edit details" }).click();
  await expect(page.getByLabel("First name")).toHaveValue("Alex");
  await page.getByRole("button", { name: "Continue to shipping" }).click();
  await page.getByRole("button", { name: "Review your order" }).click();
  await page.getByRole("button", { name: "Complete demo order" }).click();
  await expect(
    page.getByRole("heading", { name: "Your ritual awaits." }),
  ).toBeFocused();
  await expect(page.getByText(/no purchase was made/i)).toBeVisible();
  await expect(page.locator(".confirmation-receipt")).toContainText("€4.90");
  await expect(page.locator(".confirmation-receipt")).toContainText("€32.90");
  expect(transmitted).toEqual([]);
  const saved = await page.evaluate(() =>
    localStorage.getItem("shopmini-aura-v1"),
  );
  expect(saved).not.toContain("alex@example.com");
  expect(saved).toContain('"cart":[]');
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Start with a little something." }),
  ).toBeVisible();
});
test("mobile navigation, accessible search dialog and contact demo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Shop all" })
    .click();
  await expect(page).toHaveURL(/shop/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Search products" }).click();
  await page
    .getByRole("searchbox", { name: "SEARCH THE COLLECTION" })
    .fill("serum");
  await page.getByRole("button", { name: "Submit product search" }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(3);
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Alex Sample");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("alex@example.com");
  await page.getByLabel("Subject").fill("Sample question");
  await page
    .getByLabel("Your message")
    .fill("This is only a demonstration message.");
  await page.getByRole("button", { name: "Preview demo message" }).click();
  await expect(page.getByText(/your message was not sent/)).toBeVisible();
});
test("keyboard dialog focus, escape, skip link and newsletter feedback", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("button", { name: "Search products" }).click();
  await expect(
    page.getByRole("searchbox", { name: "SEARCH THE COLLECTION" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search products" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Join demo newsletter" }).click();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await page
    .getByLabel("Email for the demo newsletter")
    .fill("alex@example.com");
  await page.getByRole("button", { name: "Join demo newsletter" }).click();
  await expect(page.getByText(/No email was stored or sent/)).toBeVisible();
});
test("unavailable product cannot be purchased; malformed storage preserves valid entries", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("unrelated-demo", "preserve");
    localStorage.setItem(
      "shopmini-aura-v1",
      JSON.stringify({
        cart: [
          { productId: "aura-01", variant: "150 ml", quantity: 2 },
          { productId: "unknown", variant: "none", quantity: 4 },
        ],
        wishlist: ["aura-02", null, "unknown"],
      }),
    );
  });
  await page.reload();
  await page.goto("/cart");
  await expect(page.getByTestId("subtotal")).toHaveText("€56.00");
  await page.goto("/product/stillness-body-oil");
  await expect(
    page.getByRole("button", { name: "Currently unavailable", exact: true }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("unrelated-demo")),
  ).toBe("preserve");
});
for (const width of [375, 390, 768, 1024, 1440, 1920]) {
  test(`all pages fit a ${width}px viewport and all images load`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.goto("/product/gentle-milk-cleanser");
    await page.getByRole("button", { name: "Add to bag — €28.00" }).click();
    await page
      .getByRole("button", { name: "Save to your wishlist", exact: true })
      .click();
    for (const path of [
      "/",
      "/shop",
      "/product/gentle-milk-cleanser",
      "/cart",
      "/wishlist",
      "/checkout",
      "/about",
      "/contact",
    ]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await page.evaluate(async () => {
        for (const image of document.images) {
          image.loading = "eager";
        }
        await Promise.all(
          Array.from(document.images).map((image) =>
            image.decode().catch(() => undefined),
          ),
        );
        await document.fonts.ready;
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow at ${path}`,
      ).toBe(true);
      const broken = await page
        .locator("img")
        .evaluateAll((images) =>
          (images as HTMLImageElement[])
            .filter((image) => !image.complete || image.naturalWidth === 0)
            .map((image) => image.src),
        );
      expect(broken, `Broken images at ${path}`).toEqual([]);
    }
    expect(runtimeErrors).toEqual([]);
  });
}
for (const path of [
    "/",
    "/shop",
    "/product/daily-glow-serum",
    "/cart",
    "/wishlist",
    "/checkout",
    "/about",
    "/contact",
]) {
  test(`WCAG automated accessibility: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations, `Accessibility at ${path}`).toEqual([]);
  });
}
const seededStore = JSON.stringify({
  cart: [
    { productId: "aura-02", variant: "50 ml", quantity: 2 },
    { productId: "aura-11", variant: "75 ml", quantity: 1 },
  ],
  wishlist: ["aura-03", "aura-12"],
});
for (const width of [375, 1440]) {
  for (const path of ["/", "/shop", "/product/stillness-body-oil", "/cart", "/wishlist", "/checkout"]) {
    test(`WCAG automated accessibility, populated state at ${width}px: ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((seed) => {
        if (!sessionStorage.getItem("seeded")) {
          localStorage.setItem("shopmini-aura-v1", seed);
          sessionStorage.setItem("seeded", "1");
        }
      }, seededStore);
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations, `Accessibility at ${path}`).toEqual([]);
    });
  }
}
test("quantity merges stop at the per-size limit with accurate feedback", async ({ page }) => {
  await page.goto("/product/daily-glow-serum");
  const increase = page.getByRole("button", { name: "Increase quantity", exact: true });
  for (let index = 0; index < 7; index += 1) await increase.click();
  await page.getByRole("button", { name: "Add to bag — €336.00" }).click();
  await expect(page.locator(".quantity-note")).toHaveText(
    "8 already in your bag · up to 2 more in 30 ml.",
  );
  // The selector cannot exceed what still fits in the bag.
  await increase.click();
  await expect(increase).toBeDisabled();
  await page.getByRole("button", { name: "Add to bag — €84.00" }).click();
  await expect(page.locator(".toast")).toContainText("added to your bag");
  await expect(page.getByRole("button", { name: "Maximum already in your bag" })).toBeDisabled();
  await expect(page.locator(".quantity-note")).toContainText("maximum of 10 in 30 ml");
  await expect(page.getByRole("link", { name: "Shopping bag, 10 items" })).toBeVisible();
  // Another size is a separate line with its own allowance.
  await page.getByRole("radio", { name: "50 ml" }).check();
  await expect(page.getByRole("button", { name: "Add to bag — €56.00" })).toBeEnabled();
  await page.goto("/cart");
  await expect(page.getByTestId("subtotal")).toHaveText("€420.00");
  await expect(
    page.getByRole("button", { name: /Increase quantity for Daily Glow Serum 30 ml/i }),
  ).toBeDisabled();
  await expect(page.getByText("Limit of 10 per size reached.")).toBeVisible();
  // A quick add from a card at the limit must not claim success.
  await page.goto("/shop?category=Serums");
  await page.getByRole("button", { name: "Add Daily Glow Serum, 30 ml, to bag" }).click();
  await expect(page.locator(".toast")).toContainText("already holds the maximum of 10");
  await page.goto("/cart");
  await expect(page.getByTestId("subtotal")).toHaveText("€420.00");
});
test("minimum and maximum price filters both change results and combine with category", async ({ page }) => {
  await page.goto("/shop");
  const cards = page.getByTestId("product-card");
  const min = page.getByRole("slider", { name: "Minimum price in euros" });
  const max = page.getByRole("slider", { name: "Maximum price in euros" });
  await expect(min).toHaveAttribute("min", "18");
  await expect(max).toHaveAttribute("max", "48");
  await max.fill("47");
  await expect(cards).toHaveCount(11);
  await max.fill("48");
  await min.fill("46");
  await expect(cards).toHaveCount(2);
  await expect(page).toHaveURL(/minPrice=46/);
  await page.getByRole("button", { name: "Moisturizers", exact: true }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Velvet Night Cream");
  await min.fill("18");
  await max.fill("18");
  await expect(page.getByRole("heading", { name: "A little too specific." })).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(cards).toHaveCount(12);
  await page.goto("/shop?minPrice=40&maxPrice=30&sort=evil&category=Bogus");
  await expect(page.locator(".price-range-value")).toHaveText("€30 – €40");
  await expect(cards).toHaveCount(5);
  await expect(page.getByRole("combobox", { name: "Sort by" })).toHaveValue("featured");
});
test("pages set descriptive titles, including unknown products and routes", async ({ page }) => {
  for (const [path, title] of [
    ["/", "Rituals for Everyday Living — AURA"],
    ["/shop", "The collection — AURA"],
    ["/shop?category=Serums", "Serums — AURA"],
    ["/product/velvet-night-cream", "Velvet Night Cream — AURA"],
    ["/product/not-a-product", "Product not found — AURA"],
    ["/cart", "Your bag — AURA"],
    ["/checkout", "Demo checkout — AURA"],
    ["/nowhere", "Page not found — AURA"],
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
});
test("mobile product page shows name, price and a purchase bar without long scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/product/gentle-milk-cleanser");
  const viewportHeight = 844;
  for (const locator of [page.locator("h1"), page.locator(".detail-price")]) {
    const box = await locator.boundingBox();
    expect(box && box.y + box.height).toBeLessThan(viewportHeight * 0.45);
  }
  const bar = page.getByTestId("sticky-buy");
  await page.locator(".detail-buy").scrollIntoViewIfNeeded();
  await expect(bar).not.toHaveClass(/visible/);
  await page.evaluate(() => window.scrollBy(0, 1400));
  await expect(bar).toHaveClass(/visible/);
  await bar.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("link", { name: "Shopping bag, 1 item" })).toBeVisible();
  await expect(page.locator(".toast")).toContainText("Gentle Milk Cleanser, 150 ml added");
});
test("mobile header keeps wishlist visible, touch targets large and the drawer closes", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/shop");
  await expect(page.getByRole("link", { name: /^Wishlist, 0 saved/ })).toBeVisible();
  const small = await page.evaluate(() =>
    [...document.querySelectorAll("header a, header button, .product-card button, .product-card h3 a, footer a, footer button")]
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .filter(({ box }) => box.width > 0 && box.height > 0)
      .filter(({ element, box }) =>
        element.matches(".product-card h3 a") ? box.height < 24 : box.width < 44 || box.height < 40,
      )
      .map(({ element, box }) => `${element.textContent?.trim() || element.getAttribute("aria-label")} ${Math.round(box.width)}×${Math.round(box.height)}`),
  );
  expect(small).toEqual([]);
  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole("navigation", { name: "Shop by category" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await drawer.getByRole("link", { name: "Body Care" }).click();
  await expect(page).toHaveURL(/category=Body\+Care|category=Body%20Care/);
  await expect(drawer).not.toBeVisible();
  await expect(page.getByTestId("product-card")).toHaveCount(3);
});
for (const width of [375, 1440]) {
  test(`readable type: no visible text below 12px and 16px form controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript((seed) => {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("shopmini-aura-v1", seed);
        sessionStorage.setItem("seeded", "1");
      }
    }, seededStore);
    for (const path of ["/", "/shop", "/product/daily-glow-serum", "/cart", "/wishlist", "/checkout", "/about", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
      const report = await page.evaluate(() => {
        const tooSmall: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const parent = node.parentElement;
          if (!parent || !node.textContent?.trim()) continue;
          if (parent.closest("[aria-hidden='true'], .sr-only, dialog:not([open]), [inert]")) continue;
          const style = getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") continue;
          const rect = parent.getBoundingClientRect();
          if (!rect.width || !rect.height) continue;
          if (parseFloat(style.fontSize) < 12) tooSmall.push(`${parent.className || parent.tagName}: ${style.fontSize}`);
        }
        const smallControls = [...document.querySelectorAll("input:not([type=range]):not([type=radio]), select, textarea")]
          .filter((control) => (control as HTMLElement).offsetParent !== null)
          .filter((control) => parseFloat(getComputedStyle(control).fontSize) < 16)
          .map((control) => control.id || control.className);
        return { tooSmall: [...new Set(tooSmall)], smallControls };
      });
      expect(report.tooSmall, `Small text at ${path}`).toEqual([]);
      expect(report.smallControls, `Small controls at ${path}`).toEqual([]);
    }
  });
}
test("direct visits to lazy routes do not shift the layout", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[])
        if (!entry.hadRecentInput) (window as unknown as { __cls: number }).__cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  for (const path of ["/shop", "/product/daily-glow-serum", "/cart", "/wishlist", "/checkout", "/about", "/contact"]) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.waitForTimeout(800);
    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls, `CLS at ${path}`).toBeLessThan(0.1);
  }
});
test("corrupted storage cannot inject prices or invalid quantities", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "shopmini-aura-v1",
      JSON.stringify({
        cart: [
          { productId: "aura-01", variant: "150 ml", quantity: 2, priceCents: 1, unitPrice: 0.01 },
          { productId: "aura-02", variant: "50 ml", quantity: -3 },
          { productId: "aura-03", variant: "50 ml", quantity: 0.5 },
          { productId: "aura-07", variant: "30 ml", quantity: "5" },
          { productId: "aura-09", variant: "1 L", quantity: 1 },
          { productId: "aura-12", variant: "100 ml", quantity: 1 },
        ],
        wishlist: ["aura-03", "aura-03", {}, "zzz"],
      }),
    ),
  );
  await page.goto("/cart");
  await expect(page.locator(".cart-item")).toHaveCount(1);
  await expect(page.getByTestId("subtotal")).toHaveText("€56.00");
  await expect(page.getByTestId("shipping")).toHaveText("€4.90");
  await expect(page.getByTestId("total")).toHaveText("€60.90");
  await expect(page.getByRole("link", { name: "Wishlist, 1 saved product" })).toBeVisible();
  await page.evaluate(() => localStorage.setItem("shopmini-aura-v1", "{not json"));
  await page.reload();
  await expect(page.getByRole("heading", { name: "A little space for something lovely." })).toBeVisible();
});
test("WCAG automated accessibility: populated checkout", async ({ page }) => {
  await page.goto("/product/daily-glow-serum");
  await page.getByRole("button", { name: "Add to bag — €42.00" }).click();
  await page.goto("/checkout");
  await expect(page.getByLabel("First name")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
