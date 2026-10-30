import { getProduct } from "../data/products";
import type { Product } from "../data/products";
import { usePageMeta } from "../lib/usePageMeta";
import { useStore } from "../state/Store";
import { EmptyState, PageIntro, ProductCard } from "../components/UI";
export default function Wishlist() {
  const { wishlist } = useStore();
  usePageMeta("Your wishlist");
  // Most recently saved first.
  const saved = [...wishlist]
    .reverse()
    .map(getProduct)
    .filter((product): product is Product => Boolean(product));
  if (!saved.length)
    return (
      <EmptyState
        title="For a little later."
        text="Save the essentials that catch your eye. Your favorites will be waiting here."
        icon="heart"
        pageTitle="Your wishlist"
      />
    );
  return (
    <div className="container wishlist-page">
      <PageIntro
        eyebrow="Your own little edit"
        title="The things you love."
        text={`${saved.length} thoughtfully saved ${saved.length === 1 ? "essential" : "essentials"}. Add one to your bag in its first size, or open it to choose another.`}
      />
      <h2 className="sr-only">Saved products</h2>
      <div className="product-grid">
        {saved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
