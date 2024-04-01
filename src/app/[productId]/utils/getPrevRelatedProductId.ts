import { products } from "@/state/products";

export const getPrevRelatedProductId = (relatedProductId: number) =>
  relatedProductId === 0 ? products.length - 1 : relatedProductId - 1;
