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
  /** The seat and leg colours as they look on screen, for the colour chips on
   *  the label. These are not the tints above: a tint multiplies the model's
   *  texture, so walnut on oak looks nothing like the tint colour. */
  swatches: { seat: string; legs: string };
};

const natural = "#ffffff";

// Order here is the order around the carousel. Reordering or adding items
// needs no other code change, and existing links keep working because they
// use `id`, not the position.
export const products: ProductData[] = [
  {
    id: "axis-lounge",
    title: "Axis Lounge",
    subtitle: "Oak and oat linen",
    description:
      "The original: a light oak frame with a soft oat cushion. Easy in any room.",
    price: 130.9,
    finish: { frame: natural, cushion: natural, legs: natural },
    swatches: { seat: "#c6a38d", legs: "#e5a45c" },
  },
  {
    id: "zenith",
    title: "Zenith",
    subtitle: "Oak and sage linen",
    description:
      "Oak with a muted sage seat. Calm next to plants and natural light.",
    price: 280.0,
    finish: { frame: natural, cushion: "#b9cdaa", legs: natural },
    swatches: { seat: "#8f825c", legs: "#e5a45c" },
  },
  {
    id: "modesto",
    title: "Modesto",
    subtitle: "Walnut and sand linen",
    description:
      "A darker walnut frame softened by a warm sand cushion. Works well at a desk.",
    price: 324.0,
    finish: { frame: "#9a7660", cushion: "#dcc9ae", legs: "#7f726a" },
    swatches: { seat: "#aa805e", legs: "#714721" },
  },
  {
    id: "tranquility",
    title: "Tranquility",
    subtitle: "Oak and dusk blue linen",
    description:
      "Oak with a dusty blue seat, for quiet corners and reading nooks.",
    price: 149.1,
    finish: { frame: natural, cushion: "#a7bad4", legs: natural },
    swatches: { seat: "#817674", legs: "#e5a45c" },
  },
  {
    id: "nova",
    title: "Nova",
    subtitle: "Ebony and natural cotton",
    description:
      "A statement chair: a near-black frame and legs against a warm natural seat.",
    price: 1129.99,
    finish: { frame: "#4b403b", cushion: "#f1e8da", legs: "#2e2927" },
    swatches: { seat: "#bb9478", legs: "#281607" },
  },
  {
    id: "aura-arc",
    title: "Aura Arc",
    subtitle: "Oak and terracotta linen",
    description:
      "Warm terracotta on a light oak frame. A splash of colour that still feels natural.",
    price: 721.99,
    finish: { frame: natural, cushion: "#e29d85", legs: natural },
    swatches: { seat: "#af6347", legs: "#e5a45c" },
  },
  {
    id: "echo-recliner",
    title: "Echo Recliner",
    subtitle: "Smoked oak, charcoal wool",
    description:
      "Smoked oak with a deep charcoal seat. Made for long evenings in.",
    price: 220.0,
    finish: { frame: "#7a6458", cushion: "#5b6270", legs: "#5d4c43" },
    swatches: { seat: "#453c3b", legs: "#532e12" },
  },
  {
    id: "luna",
    title: "Luna",
    subtitle: "Oak and blush linen",
    description:
      "A blush seat on a soft oak frame. Light and gentle in a small room.",
    price: 147.98,
    finish: { frame: "#c2a894", cushion: "#efc4c1", legs: "#d6cdc4" },
    swatches: { seat: "#b97c69", legs: "#c08345" },
  },
];

export const getProductIndex = (id: string | undefined) =>
  products.findIndex((product) => product.id === id);

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
export const formatPrice = (price: number) => usd.format(price);
