export type ProductData = {
  /** Stable URL slug. The carousel's active item is looked up by this. */
  id: string;
  title: string;
  subtitle: string;
  price: number;
};

// Order here is the order around the carousel. Reordering or adding items
// needs no other code change, and existing links keep working because they
// use `id`, not the position.
export const products: ProductData[] = [
  { id: "axis-lounge", title: "Axis Lounge", subtitle: "Chair, Brown", price: 130.9 },
  { id: "zenith", title: "Zenith", subtitle: "Chair, Gray", price: 280.0 },
  { id: "modesto", title: "Modesto", subtitle: "Chair, Gray", price: 324.0 },
  { id: "tranquility", title: "Tranquility", subtitle: "Chair, Gray", price: 149.1 },
  { id: "nova", title: "Nova", subtitle: "Chair, Gray", price: 1129.99 },
  { id: "aura-arc", title: "Aura Arc", subtitle: "Chair, Gray", price: 721.99 },
  { id: "echo-recliner", title: "Echo Recliner", subtitle: "Chair, Gray", price: 220.0 },
  { id: "luna", title: "Luna", subtitle: "Chair, Gray", price: 147.98 },
];

export const getProductIndex = (id: string | undefined) =>
  products.findIndex((product) => product.id === id);
