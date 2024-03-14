import { ProductSpringRef, productsSpringAtom } from "@/state/products";
import { products } from "../products";
import { getCarouselPositionX } from "./utils";
import { detailItemPosition } from "@/state/constants";
import { Vector3Tuple } from "three";
import { CameraSpringRef, cameraSpringAtom } from "@/state/camera";
import { easings } from "@react-spring/web";

export const detailCameraPosition: Vector3Tuple = [-0.011403, -1.6, 0.8];
export const detailCameraTarget: Vector3Tuple = [0, 0, 0.2];

export const animateCameraToProduct = async ({
  productId,
  productsSpring,
  cameraSpring,
}: {
  productId: string;
  productsSpring: ProductSpringRef;
  cameraSpring: CameraSpringRef;
}) => {
  const product = productsSpring?.current[Number(productId)].get();
  return cameraSpring?.start({
    position: [product.position[0], -5.26023, product.position[2]],
    target: product.position,
    config: { duration: 1000 },
  });
};

export const animateProductToCenter = async ({
  productId,
  productsSpring,
  cameraSpring,
}: {
  productId: string;
  productsSpring: ProductSpringRef;
  cameraSpring: CameraSpringRef;
}) => {
  const product = productsSpring?.current[Number(productId)].get();
  cameraSpring?.start({
    to: async (next) => {
      await next({
        position: [
          product.position[0] - 0.011403,
          -5.26023,
          product.position[2] + 0.9,
        ],
        target: product.position,
        config: { duration: 1000 },
      });
      await next({
        position: detailCameraPosition,
        target: detailCameraTarget,
        config: { duration: 1000 },
      });
    },
  });
  return productsSpring?.start((i: number) => {
    const currentPosition = productsSpring?.current[i].get().position;
    if (i === product.i)
      return {
        position: [0, -0.324315, 0],
        shelfPosition: [0, 3, 0],
        sliderOpacity: 1,
        sliderPoints: 361,
        slider: true,
        ring: false,
        config: { duration: 1000 },
        delay: 1000,
      };
    const newPosition =
      currentPosition[0] < product.position[0]
        ? [currentPosition[0] - 10, currentPosition[1], currentPosition[2]]
        : [currentPosition[0] + 10, currentPosition[1], currentPosition[2]];

    return {
      position: newPosition,
      shelfPosition: [0, 3, -2],
      slider: true,
      ring: false,
      config: { duration: 1000 },
      delay: 1000,
    };
  });
};

// export const animateProductsAwayFromCenter = ({
//   id,
//   productsSpring,
// }: {
//   id: number;
//   productsSpring: ProductSpringRef;
// }) => {
//   return productsSpring?.start((i) => {
//     if (index === i) return;
//     const selectedPosition = products[index].position;
//     const position = products[i].position;

//     const outPositionX =
//       selectedPosition < position ? position[0] + 10 : position[0] - 10;
//     // const carouselPositionX = getCarouselPositionX(i, {
//     //   i: index,
//     //   position: selectedPosition,
//     // });
//     return {
//       to: async (next) => {
//         await next({
//           position: [outPositionX, position[1], position[2]],
//           config: {
//             duration: 1500,
//           },
//         });
//         // await next({
//         //   position: [carouselPositionX, -10.3, position[2]],
//         //   config: {
//         //     duration: 1500,
//         //   },
//         //   delay: 0,
//         // });
//       },
//     };
//   });
// };
