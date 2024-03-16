import { ProductSpringRef, products } from "@/state/products";
import { SliderSpringRef } from "@/state/slider";

export const animateProductsToWall = async ({
  productsSpring,
}: {
  productsSpring: ProductSpringRef;
}) => {
  productsSpring?.start((i: number) => {
    const product = products.find((product) => product.i === i);
    return {
      config: { duration: 500 },
    };
  });
  return productsSpring?.start((i: number) => {
    const product = products.find((product) => product.i === i);
    return {
      position: product?.position,
      shelfPosition: [0, 0, 0],
      ring: true,
      config: { duration: 1000 },
      delay: 1000,
    };
  });
};
