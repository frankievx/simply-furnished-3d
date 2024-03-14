import { CameraSpringRef } from "@/state/camera";
import { ProductSpringRef } from "@/state/products";

export const animateCameraToRelatedProducts = async ({
  productId,
  productsSpring,
  cameraSpring,
}: {
  productId: string;
  productsSpring: ProductSpringRef;
  cameraSpring: CameraSpringRef;
}) => {
  return cameraSpring?.start({
    position: [0, -3.26023, -9],
    target: [0, 0, -9.5],
    config: { duration: 1000 },
  });
};
