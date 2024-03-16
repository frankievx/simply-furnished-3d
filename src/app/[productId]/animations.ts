import { ProductSpringRef } from "@/state/products";
import { Vector3Tuple } from "three";
import { CameraSpringRef } from "@/state/camera";
import { SliderSpringRef } from "@/state/slider";

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
  sliderSpring,
}: {
  productId: string;
  productsSpring: ProductSpringRef;
  cameraSpring: CameraSpringRef;
  sliderSpring: SliderSpringRef;
}) => {
  const product = productsSpring?.current[Number(productId)].get();
  sliderSpring.start({
    points: 361,
    opacity: 1,
    config: { duration: 1000 },
    delay: 1800,
  });
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
    const currentProduct = productsSpring?.current[i].get();
    const currentPosition = currentProduct.position;
    if (currentProduct.i === product.i)
      return {
        position: [0, -0.324315, 0],
        shelfPosition: [0, 3, 0],
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
      ring: false,
      config: { duration: 1000 },
      delay: 1000,
    };
  });
};
