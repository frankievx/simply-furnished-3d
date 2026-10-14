import { ProductSpringRef, ProductType, products } from "@/state/products";
import {
  getRelatedProducts,
  selectedProductRotation,
} from "@/app/@canvas/utils";
import { easings } from "@react-spring/web";
import { Vector3Tuple } from "three";

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
        rotation: selectedProductRotation,
        config: { duration, easing: easings.easeInOutQuad },
      };
    } else if ([0, products.length - 1].includes(relatedProduct.order))
      return { ...relatedProduct, config: { duration: 0 } };
    return {
      ...relatedProduct,
      rotation: [0, 0, 0] as Vector3Tuple,
      config: { duration, easing: easings.easeInOutQuad },
    };
  });
  relatedProductsApi.start((i) => {
    return {
      ...newRelatedProducts[i],
    };
  });
};
