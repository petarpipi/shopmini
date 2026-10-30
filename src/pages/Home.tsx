import { ArrowDown, ArrowRight, Flower2, Leaf, Package, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { categories, getProduct, products } from "../data/products";
import type { Product } from "../data/products";
import { ArrowLink, ProductCard, productImage } from "../components/UI";
import { Newsletter } from "../components/Shell";
import { usePageMeta } from "../lib/usePageMeta";
const editorsSelection = ["aura-07", "aura-09", "aura-11"]
  .map(getProduct)
  .filter((product): product is Product => Boolean(product));
export default function Home() {
  usePageMeta("Rituals for Everyday Living");
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow">
            <span className="tiny-line" aria-hidden="true" /> Less, but more
            considered
          </span>
          <h1 id="hero-title">
            Rituals for
            <br />
            Everyday
            <br />
            <em>Living.</em>
          </h1>
          <p>
            Thoughtfully formulated essentials for your daily moments of care.
          </p>
          <Link className="button" to="/shop">
            Explore Collection <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <a className="hero-bottom" href="#essentials">
            <span className="sun-seal" aria-hidden="true">
              <Sun size={25} strokeWidth={1} />
            </span>
            <span>
              Small moments.
              <br />A beautiful everyday.
            </span>
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="hero-visual">
          <img
            src="/images/hero.webp"
            srcSet="/images/hero-800.webp 800w, /images/hero.webp 1600w"
            sizes="(max-width: 600px) 100vw, 57vw"
            width="1600"
            height="1067"
            alt="AURA concept skincare arranged on warm travertine in soft afternoon light"
            fetchPriority="high"
          />
          <p className="hero-image-label">
            <span>The everyday collection · Vol. 01</span>
            Thoughtfully made. <em>Simply essential.</em>
          </p>
        </div>
      </section>
      <div className="values-strip">
        <span>
          <Leaf size={18} strokeWidth={1.4} aria-hidden="true" /> Considered
          ingredients
        </span>
        <span>
          <Flower2 size={18} strokeWidth={1.4} aria-hidden="true" /> A softer
          approach to care
        </span>
        <span>
          <Package size={18} strokeWidth={1.4} aria-hidden="true" /> Thoughtful
          by design
        </span>
      </div>
      <section id="essentials" className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Meet your daily ritual</span>
            <h2>
              Everyday <em>essentials.</em>
            </h2>
          </div>
          <ArrowLink to="/shop">Discover all essentials</ArrowLink>
        </div>
        <div className="product-grid">
          {products
            .filter((product) => product.featured)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      <section className="category-section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A moment for every part of you</span>
            <h2>
              Find your <em>ritual.</em>
            </h2>
          </div>
          <span className="section-side-note">
            Simple steps. Thoughtfully chosen.
          </span>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => {
            const cover = products.find((product) => product.category === category)!;
            return (
              <Link
                className="category-card"
                to={`/shop?category=${encodeURIComponent(category)}`}
                key={category}
              >
                <img
                  src={productImage(cover, 480)}
                  alt=""
                  width="480"
                  height="720"
                  loading="lazy"
                />
                <div>
                  <span className="category-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{category}</h3>
                  <ArrowRight size={22} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="philosophy" aria-labelledby="philosophy-title">
        <div className="philosophy-photo">
          <img
            src="/images/hero-800.webp"
            srcSet="/images/hero-800.webp 800w, /images/hero.webp 1600w"
            sizes="(max-width: 600px) 100vw, 50vw"
            alt="A warm, tactile still life of the AURA concept collection"
            width="1600"
            height="1067"
            loading="lazy"
          />
        </div>
        <div className="philosophy-copy">
          <span className="eyebrow">Our philosophy</span>
          <h2 id="philosophy-title">
            Carefully chosen.
            <br />
            <em>Quietly beautiful.</em>
          </h2>
          <p>
            We believe the most meaningful rituals are often the simplest. A
            warm splash of water. A moment to pause. Care that fits the day you
            actually have.
          </p>
          <p>
            AURA is a study in the essentials — considered textures, understated
            design, and the beauty of doing less, better.
          </p>
          <ArrowLink to="/about">The story behind AURA</ArrowLink>
        </div>
      </section>
      <section className="section container bestsellers">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The editor’s selection</span>
            <h2>
              A few <em>favorites.</em>
            </h2>
          </div>
          <ArrowLink to="/shop">Explore the collection</ArrowLink>
        </div>
        <div className="product-grid three-products">
          {editorsSelection.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <p className="fine-print selection-note">
          An editorial selection for this concept store — no sales rankings
          implied.
        </p>
      </section>
      <section className="editorial" aria-labelledby="journal-title">
        <span className="eyebrow">The everyday journal · Note 001</span>
        <h2 id="journal-title">
          Make space
          <br />
          for <em>yourself.</em>
        </h2>
        <p>
          There is beauty in a slower morning.
          <br />
          In small rituals. In coming back to you.
        </p>
        <ArrowLink to="/about#rituals">A note on thoughtful living</ArrowLink>
      </section>
      <Newsletter />
    </>
  );
}
