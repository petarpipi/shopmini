export const categories = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Body Care",
] as const;
export type Category = (typeof categories)[number];
export interface Variant {
  name: string;
  extraCents: number;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  priceCents: number;
  description: string;
  image: string;
  variants: Variant[];
  inStock: boolean;
  note: string;
  texture: string;
  ritual: string;
  ingredients: string;
  featured?: boolean;
}

const small = [
  { name: "30 ml", extraCents: 0 },
  { name: "50 ml", extraCents: 1400 },
];
const cream = [
  { name: "50 ml", extraCents: 0 },
  { name: "100 ml", extraCents: 2200 },
];
const wash = [
  { name: "150 ml", extraCents: 0 },
  { name: "250 ml", extraCents: 1000 },
];
const body = [
  { name: "250 ml", extraCents: 0 },
  { name: "500 ml", extraCents: 1800 },
];
export const products: Product[] = [
  {
    id: "aura-01",
    slug: "gentle-milk-cleanser",
    name: "Gentle Milk Cleanser",
    category: "Cleansers",
    priceCents: 2800,
    description:
      "A soft, milky first step. An unhurried cleanse with a delicate oat-inspired finish.",
    image: "/images/cleanser.webp",
    variants: wash,
    inStock: true,
    note: "Your morning, made softer.",
    texture: "Light, milky emulsion",
    ritual: "Massage onto damp skin, then rinse with lukewarm water.",
    ingredients:
      "Concept ingredients: oat extract, glycerin, and a water-based cleansing blend.",
    featured: true,
  },
  {
    id: "aura-02",
    slug: "daily-glow-serum",
    name: "Daily Glow Serum",
    category: "Serums",
    priceCents: 4200,
    description:
      "A silky, lightweight layer for a considered daily ritual. A little moment of luminosity.",
    image: "/images/serum.webp",
    variants: small,
    inStock: true,
    note: "A small drop. A daily ritual.",
    texture: "Silky, fluid serum",
    ritual:
      "Smooth two or three drops over clean skin before your moisturizer.",
    ingredients:
      "Concept ingredients: glycerin, niacinamide, and botanical extracts.",
    featured: true,
  },
  {
    id: "aura-03",
    slug: "essential-face-cream",
    name: "Essential Face Cream",
    category: "Moisturizers",
    priceCents: 3800,
    description:
      "The comforting finishing touch. A cloud-soft cream with a beautifully understated feel.",
    image: "/images/moisturizer.webp",
    variants: cream,
    inStock: true,
    note: "Comfort, in its simplest form.",
    texture: "Soft, enveloping cream",
    ritual:
      "Warm a small amount between your fingertips and smooth over your face.",
    ingredients: "Concept ingredients: squalane, shea butter, and glycerin.",
    featured: true,
  },
  {
    id: "aura-04",
    slug: "botanical-body-lotion",
    name: "Botanical Body Lotion",
    category: "Body Care",
    priceCents: 3200,
    description:
      "A quietly fragrant body lotion with a smooth finish. Turn an everyday gesture into time for yourself.",
    image: "/images/body.webp",
    variants: body,
    inStock: true,
    note: "Care, from head to toe.",
    texture: "Light, flowing lotion",
    ritual: "Massage onto clean skin, taking a moment to pause.",
    ingredients:
      "Concept ingredients: almond oil, glycerin, and a botanical fragrance.",
    featured: true,
  },
  {
    id: "aura-05",
    slug: "soft-foam-cleanser",
    name: "Soft Foam Cleanser",
    category: "Cleansers",
    priceCents: 2600,
    description:
      "An airy cleansing foam with a light touch. Made for the beauty of starting fresh.",
    image: "/images/soft-foam-cleanser.webp",
    variants: wash,
    inStock: true,
    note: "A fresh beginning.",
    texture: "Airy, fine foam",
    ritual: "Work a small amount into damp hands. Massage gently and rinse.",
    ingredients:
      "Concept ingredients: mild surfactants, glycerin, and chamomile extract.",
  },
  {
    id: "aura-06",
    slug: "evening-cleansing-oil",
    name: "Evening Cleansing Oil",
    category: "Cleansers",
    priceCents: 3400,
    description:
      "A golden oil for the transition from a busy day to a slower evening.",
    image: "/images/evening-cleansing-oil.webp",
    variants: wash,
    inStock: true,
    note: "Leave the day behind.",
    texture: "Smooth, golden oil",
    ritual: "Massage onto dry skin, add a little water, and rinse thoroughly.",
    ingredients:
      "Concept ingredients: sunflower oil, squalane, and an emulsifying blend.",
  },
  {
    id: "aura-07",
    slug: "quiet-night-serum",
    name: "Quiet Night Serum",
    category: "Serums",
    priceCents: 4800,
    description:
      "A rich, unhurried evening layer. Settle into a little stillness before the lights go out.",
    image: "/images/quiet-night-serum.webp",
    variants: small,
    inStock: true,
    note: "An invitation to slow down.",
    texture: "Rich, satin-like fluid",
    ritual: "Apply a few drops to clean skin as part of your evening routine.",
    ingredients:
      "Concept ingredients: squalane, jojoba oil, and botanical extracts.",
  },
  {
    id: "aura-08",
    slug: "dew-drop-serum",
    name: "Dew Drop Serum",
    category: "Serums",
    priceCents: 3600,
    description:
      "A fresh, featherlight serum with a barely-there finish. Simple layers, thoughtfully chosen.",
    image: "/images/dew-drop-serum.webp",
    variants: small,
    inStock: true,
    note: "A lighter kind of ritual.",
    texture: "Water-light gel",
    ritual: "Press a few drops onto clean skin and follow with a cream.",
    ingredients: "Concept ingredients: glycerin, hyaluronic acid, and water.",
  },
  {
    id: "aura-09",
    slug: "velvet-night-cream",
    name: "Velvet Night Cream",
    category: "Moisturizers",
    priceCents: 4600,
    description:
      "A generous, velvety cream for your last moment of care before bed.",
    image: "/images/velvet-night-cream.webp",
    variants: cream,
    inStock: true,
    note: "The art of winding down.",
    texture: "Rich, velvety cream",
    ritual: "Smooth a small amount over clean skin in the evening.",
    ingredients: "Concept ingredients: shea butter, squalane, and oat extract.",
  },
  {
    id: "aura-10",
    slug: "cloud-light-moisturizer",
    name: "Cloud Light Moisturizer",
    category: "Moisturizers",
    priceCents: 3400,
    description:
      "An easy, airy everyday cream for people who prefer their rituals light.",
    image: "/images/cloud-light-moisturizer.webp",
    variants: cream,
    inStock: true,
    note: "Less weight. More ease.",
    texture: "Airy gel-cream",
    ritual: "Apply an even layer to clean skin morning or evening.",
    ingredients:
      "Concept ingredients: glycerin, aloe extract, and a light emollient blend.",
  },
  {
    id: "aura-11",
    slug: "linen-hand-cream",
    name: "Linen Hand Cream",
    category: "Body Care",
    priceCents: 1800,
    description:
      "A soft, subtle cream for hands that do so much. Keep a little care within reach.",
    image: "/images/linen-hand-cream.webp",
    variants: [
      { name: "75 ml", extraCents: 0 },
      { name: "150 ml", extraCents: 1200 },
    ],
    inStock: true,
    note: "A moment, close at hand.",
    texture: "Soft, smooth cream",
    ritual: "Massage a small amount into clean hands as desired.",
    ingredients: "Concept ingredients: shea butter, almond oil, and glycerin.",
  },
  {
    id: "aura-12",
    slug: "stillness-body-oil",
    name: "Stillness Body Oil",
    category: "Body Care",
    priceCents: 4400,
    description:
      "A warm, satin-finish body oil inspired by long, quiet evenings.",
    image: "/images/stillness-body-oil.webp",
    variants: [{ name: "100 ml", extraCents: 0 }],
    inStock: false,
    note: "Take your time.",
    texture: "Satin-finish oil",
    ritual: "Massage onto clean skin with slow, sweeping motions.",
    ingredients:
      "Concept ingredients: jojoba oil, sunflower oil, and botanical fragrance.",
  },
];
export const getProduct = (id: string) =>
  products.find((product) => product.id === id);
export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
