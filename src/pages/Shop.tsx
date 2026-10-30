import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/products";
import {
  filterProducts,
  filtersAreActive,
  filtersFromParams,
  initialFilters,
  priceBounds,
  sortOptions,
} from "../lib/commerce";
import type { Filters } from "../lib/commerce";
import { usePageMeta } from "../lib/usePageMeta";
import { PageIntro, ProductCard } from "../components/UI";
const percent = (euros: number) =>
  ((euros - priceBounds.min) / (priceBounds.max - priceBounds.min)) * 100;
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const filters = filtersFromParams(params, categories);
  usePageMeta(
    filters.category === "All" ? "The collection" : filters.category,
    "Browse the twelve AURA concept essentials: cleansers, serums, moisturizers and body care.",
  );
  const update = (changes: Partial<Filters>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (
        value === "" ||
        String(value) === String(initialFilters[key as keyof Filters])
      )
        next.delete(key);
      else next.set(key, String(value));
    }
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const visible = filterProducts(filters);
  const active = filtersAreActive(filters);
  const clear = () => setParams({}, { preventScrollReset: true });
  return (
    <div className="container shop-page">
      <PageIntro
        eyebrow="The AURA collection"
        title="Considered care. Everyday beauty."
        text="Twelve thoughtful essentials. Find the little things that make your everyday feel a little more you."
      />
      <div className="shop-tools">
        <div
          className="category-tabs"
          role="group"
          aria-label="Product categories"
        >
          {["All", ...categories].map((item) => (
            <button
              key={item}
              aria-pressed={filters.category === item}
              className={filters.category === item ? "active" : ""}
              onClick={() => update({ category: item })}
            >
              {item === "All" ? "All essentials" : item}
            </button>
          ))}
        </div>
        <label className="shop-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search collection</span>
          <input
            type="search"
            value={filters.search}
            maxLength={80}
            placeholder="Search the collection"
            onChange={(event) => update({ search: event.target.value })}
          />
        </label>
      </div>
      <div className="filter-row">
        <fieldset className="price-filter">
          <legend>
            <SlidersHorizontal size={16} aria-hidden="true" />
            Starting price
            <output className="price-range-value">
              €{filters.minPrice} – €{filters.maxPrice}
            </output>
          </legend>
          <div
            className="price-sliders"
            style={
              {
                "--from": `${percent(filters.minPrice)}%`,
                "--to": `${percent(filters.maxPrice)}%`,
              } as React.CSSProperties
            }
          >
            <label>
              <span className="sr-only">Minimum price in euros</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step="1"
                value={filters.minPrice}
                aria-valuetext={`€${filters.minPrice}`}
                onChange={(event) =>
                  update({
                    minPrice: Math.min(
                      Number(event.target.value),
                      filters.maxPrice,
                    ),
                  })
                }
              />
            </label>
            <label>
              <span className="sr-only">Maximum price in euros</span>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                step="1"
                value={filters.maxPrice}
                aria-valuetext={`€${filters.maxPrice}`}
                onChange={(event) =>
                  update({
                    maxPrice: Math.max(
                      Number(event.target.value),
                      filters.minPrice,
                    ),
                  })
                }
              />
            </label>
          </div>
        </fieldset>
        <div className="filter-summary">
          <span role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? "essential" : "essentials"}
          </span>
          {active && (
            <button className="text-button" onClick={clear}>
              Clear filters <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        <label className="sort-label">
          Sort by
          <select
            value={filters.sort}
            onChange={(event) =>
              update({ sort: event.target.value as Filters["sort"] })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <h2 className="sr-only">Products</h2>
      {visible.length ? (
        <div className="product-grid shop-grid">
          {visible.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state shop-empty">
          <Search size={32} strokeWidth={1} aria-hidden="true" />
          <h3>A little too specific.</h3>
          <p>
            No essentials match these filters. Try another word or widen the
            price range.
          </p>
          <button className="button" onClick={clear}>
            Clear all filters
          </button>
        </div>
      )}
      <aside className="catalog-note" aria-label="About this collection">
        <span className="eyebrow">A note on this collection</span>
        <p>
          AURA is a fictional concept. AI-created product photography
          illustrates the packaging direction. Rendered labels and volumes may
          differ from catalog details. Prices filter and sort by each
          product’s smallest size.
        </p>
      </aside>
    </div>
  );
}
