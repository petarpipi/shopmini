import { ArrowRight, Flower2, Leaf, Package, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Newsletter } from "../components/Shell";
import { usePageMeta } from "../lib/usePageMeta";
export default function About() {
  usePageMeta(
    "Our philosophy",
    "The story, design values and packaging concept behind AURA, a fictional skincare brand.",
  );
  return (
    <>
      <section className="about-hero container">
        <span className="eyebrow">THE PHILOSOPHY OF AURA</span>
        <h1>
          A little less.
          <br />
          <em>A little more meaning.</em>
        </h1>
        <p>
          We imagine a world where care is less complicated.
          <br />
          Fewer distractions. More intention. Room to simply be.
        </p>
        <span className="concept-label">
          AN ORIGINAL, FICTIONAL BRAND CONCEPT
        </span>
      </section>
      <div className="about-wide-image">
        <img
          src="/images/hero.webp"
          srcSet="/images/hero-800.webp 800w, /images/hero.webp 1600w"
          sizes="100vw"
          alt="The AURA concept collection in a sunlit, natural setting"
          width="1600"
          height="1067"
        />
      </div>
      <section className="about-story container" id="rituals">
        <div>
          <span className="eyebrow">A NOTE ON THOUGHTFUL LIVING</span>
          <h2>
            Not another step.
            <br />
            <em>A moment for you.</em>
          </h2>
        </div>
        <div>
          <p>
            Somewhere between the first light and the last thing on your list,
            there is a moment that belongs to you. A pause at the basin. A soft
            texture on your skin. A small reminder to take your time.
          </p>
          <p>
            AURA began as an idea: what if everyday care felt like an
            invitation, rather than another obligation? This collection explores
            that thought through simple objects, warm materials, and a
            deliberately quiet visual language.
          </p>
          <p>
            It is a fictional skincare brand, created to bring a real design
            question to life. Every detail — from the space between letters to
            the way a product enters your bag — is considered.
          </p>
        </div>
      </section>
      <section className="about-values container">
        <article>
          <Sun size={29} strokeWidth={1} />
          <span className="eyebrow">01 / SIMPLICITY</span>
          <h3>The essential things.</h3>
          <p>
            A compact concept collection with clear categories and simple
            rituals. Enough choice to find your own rhythm.
          </p>
        </article>
        <article>
          <Leaf size={29} strokeWidth={1} />
          <span className="eyebrow">02 / INTENTION</span>
          <h3>A considered touch.</h3>
          <p>
            Textures and ingredient stories are illustrative, thoughtfully
            written without clinical promises or invented credentials.
          </p>
        </article>
        <article>
          <Package size={29} strokeWidth={1} />
          <span className="eyebrow">03 / DESIGN</span>
          <h3>Objects worth keeping.</h3>
          <p>
            Quiet forms. Warm finishes. Packaging imagined to belong in your
            daily space, rather than hide away in a drawer.
          </p>
        </article>
      </section>
      <section className="packaging-section" id="packaging">
        <div>
          <img
            src="/images/moisturizer.webp"
            alt="Frosted ivory AURA concept jar with an understated sage lid"
            width="960"
            height="1440"
            loading="lazy"
          />
        </div>
        <div>
          <Flower2 size={35} strokeWidth={1} />
          <span className="eyebrow">MATERIALS & PACKAGING CONCEPT</span>
          <h2>
            Beautiful to hold.
            <br />
            <em>Simple to understand.</em>
          </h2>
          <p>
            Amber glass, frosted ivory, muted sage, and tactile paper labels
            form our imagined material palette. A family of quiet objects, with
            a natural place in your everyday.
          </p>
          <p>
            These are design intentions, not manufacturing or sustainability
            certifications. AI-created imagery visualizes the packaging
            direction. Each product has its own concept image; rendered labels
            and volumes may differ from catalog details.
          </p>
          <Link className="arrow-link" to="/shop">
            Meet the collection <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
