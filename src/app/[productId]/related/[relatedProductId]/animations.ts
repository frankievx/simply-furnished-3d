import { CameraSpringRef } from "@/state/camera";
import { ProductSpringRef, ProductType, products } from "@/state/products";
import { getRelatedProducts } from "@/app/@canvas/utils";
import { easings } from "@react-spring/web";
import { Vector3Tuple } from "three";

export const animateCameraToRelatedProducts = async ({
  cameraSpring,
  delay = 0,
}: {
  cameraSpring: CameraSpringRef;
  delay?: number;
}) => {
  return cameraSpring?.start({
    position: [0, -3.26023, -9],
    target: [0, 0, -9.5],
    config: { duration: 1500 },
    delay,
  });
};

export const animateRelatedProducts = ({
  relatedProductsApi,
  product,
  duration = 1500,
}: {
  relatedProductsApi: ProductSpringRef;
  product: ProductType;
  duration?: number;
}) => {
  const newRelatedProducts = getRelatedProducts({
    selected: product,
  }).map((relatedProduct) => {
    if (product.i === relatedProduct.i) {
      return {
        ...relatedProduct,
        rotation: [0, 0, 0.2] as Vector3Tuple,
        config: { duration, easing: easings.easeOutQuad },
      };
    } else if ([0, products.length - 1].includes(relatedProduct.order))
      return { ...relatedProduct, config: { duration: 0 } };
    return {
      ...relatedProduct,
      rotation: [0, 0, 0] as Vector3Tuple,
      config: { duration, easing: easings.easeOutQuad },
    };
  });
  relatedProductsApi.start((i) => {
    return {
      ...newRelatedProducts[i],
      shelf: false,
      ring: false,
      slider: false,
      sliderOpacity: 0,
      sliderPoints: 0,
    };
  });
};
