import { products } from "@/state/products";

export const getNextRelatedProductId = (relatedProductId: number) => {
  return relatedProductId === products.length - 1 ? 0 : relatedProductId + 1;
};
