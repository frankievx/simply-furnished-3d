import { ProductSpringRef, products } from "@/state/products";

export const animateProductsToWall = async ({
  productsSpring,
}: {
  productsSpring: ProductSpringRef;
}) => {
  // const product = productsSpring?.current[Number(productId)].get();
  // cameraSpring?.start({
  //   to: async (next) => {
  //     await next({
  //       position: [
  //         product.position[0] - 0.011403,
  //         -5.26023,
  //         product.position[2] + 0.9,
  //       ],
  //       target: product.position,
  //       config: { duration: 1000 },
  //     });
  //     await next({
  //       position: detailCameraPosition,
  //       target: detailCameraTarget,
  //       config: { duration: 1000 },
  //     });
  //   },
  // });
  productsSpring?.start((i: number) => {
    const product = products.find((product) => product.i === i);
    return {
      ring: true,
      slider: false,
      sliderOpacity: 0,
      config: { duration: 500 },
    };
  });
  return productsSpring?.start((i: number) => {
    const product = products.find((product) => product.i === i);
    return {
      position: product?.position,
      shelfPosition: [0, 0, 0],
      // ring: true,
      // slider: false,
      // sliderOpacity: 0,
      config: { duration: 1000 },
      delay: 1000,
    };
  });
};
