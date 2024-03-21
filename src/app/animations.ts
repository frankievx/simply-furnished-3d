import { ProductSpringRef, products } from "@/state/products";

export const animateProductsToWall = async ({
  productsApi,
}: {
  productsApi: ProductSpringRef;
}) => {
  productsApi?.start((i: number) => {
    return {
      config: { duration: 500 },
    };
  });
  return productsApi?.start((i: number) => {
    const product = products.find((product) => product.i === i);
    return {
      position: product?.position,
      rotation: [0, 0, 0],
      shelfPosition: [0, 0, 0],
      ring: true,
      config: { duration: 1000 },
      delay: 1000,
    };
  });
};
