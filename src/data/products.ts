/**
 * Tints multiplied into the chair model's own textures, so white keeps the
 * original look and anything darker or warmer shifts it. One chair model is
 * shared by every product; these colours are what tell them apart.
 */
export type Finish = {
  /** The shell behind the cushion: the back and seat edges. */
  frame: string;
  /** The seat and back cushion. */
  cushion: string;
  /** The legs. */
  legs: string;
};

export type ProductData = {
  /** Stable URL slug. The carousel's active item is looked up by this. */
  id: string;
  title: string;
  /** What the chair is made of, matching the finish shown. */
  subtitle: string;
  /** One or two sentences for the detail caption and the cart. */
  description: string;
  price: number;
  finish: Finish;
};

const natural = "#ffffff";

// Order here is the order around the carousel. Reordering or adding items
// needs no other code change, and existing links keep working because they
// use `id`, not the position.
export const products: ProductData[] = [
  {
    id: "axis-lounge",
    title: "Axis Lounge",
    subtitle: "Chair, Oak and oat linen",
    description:
      "The original: a light oak frame with a soft oat cushion. Easy in any room.",
    price: 130.9,
    finish: { frame: natural, cushion: natural, legs: natural },
  },
  {
    id: "zenith",
    title: "Zenith",
    subtitle: "Chair, Oak and sage linen",
    description:
      "Oak with a muted sage seat. Calm next to plants and natural light.",
    price: 280.0,
    finish: { frame: natural, cushion: "#b9cdaa", legs: natural },
  },
  {
    id: "modesto",
    title: "Modesto",
    subtitle: "Chair, Walnut and sand linen",
    description:
      "A darker walnut frame softened by a warm sand cushion. Works well at a desk.",
    price: 324.0,
    finish: { frame: "#9a7660", cushion: "#dcc9ae", legs: "#7f726a" },
  },
  {
    id: "tranquility",
    title: "Tranquility",
    subtitle: "Chair, Oak and dusk blue linen",
    description:
      "Oak with a dusty blue seat, for quiet corners and reading nooks.",
    price: 149.1,
    finish: { frame: natural, cushion: "#a7bad4", legs: natural },
  },
  {
    id: "nova",
    title: "Nova",
    subtitle: "Chair, Ebony and natural cotton",
    description:
      "A statement chair: a near-black frame and legs against a warm natural seat.",
    price: 1129.99,
    finish: { frame: "#4b403b", cushion: "#f1e8da", legs: "#2e2927" },
  },
  {
    id: "aura-arc",
    title: "Aura Arc",
    subtitle: "Chair, Oak and terracotta linen",
    description:
      "Warm terracotta on a light oak frame. A splash of colour that still feels natural.",
    price: 721.99,
    finish: { frame: natural, cushion: "#e29d85", legs: natural },
  },
  {
    id: "echo-recliner",
    title: "Echo Recliner",
    subtitle: "Chair, Smoked oak and charcoal wool",
    description:
      "Smoked oak with a deep charcoal seat. Made for long evenings in.",
    price: 220.0,
    finish: { frame: "#7a6458", cushion: "#5b6270", legs: "#5d4c43" },
  },
  {
    id: "luna",
    title: "Luna",
    subtitle: "Chair, Oak and blush linen",
    description:
      "A blush seat on a soft oak frame. Light and gentle in a small room.",
    price: 147.98,
    finish: { frame: "#c2a894", cushion: "#efc4c1", legs: "#d6cdc4" },
  },
];

export const getProductIndex = (id: string | undefined) =>
  products.findIndex((product) => product.id === id);

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export const formatPrice = (price: number) => usd.format(price);
