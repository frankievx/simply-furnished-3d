import { Vector3Tuple } from "three";
import { ProductType, ProductsType, products } from "@/state/products";

export function getMidpointIndex(products: ProductsType) {
  return Math.round(products.length / 2);
}

export const getRelatedProducts = ({ selected }: { selected: ProductType }) => {
  let floorItems: ProductsType = [];
  const listMidpointIndex = getMidpointIndex(products);

  const indexDifference =
    listMidpointIndex - (selected ? selected.i : listMidpointIndex);
  const breakIndex =
    indexDifference < 0
      ? indexDifference * -1
      : products.length - indexDifference;
  if (indexDifference < 0) {
    floorItems = [
      ...products.slice(breakIndex, products.length),
      ...products.slice(0, breakIndex),
    ];
  } else if (indexDifference > 0) {
    floorItems = [
      ...products.slice(breakIndex, products.length),
      ...products.slice(0, breakIndex),
    ];
  } else {
    floorItems = [...products.map((item) => item)];
  }

  return products.map((product, i) => {
    const orderIndex = floorItems.findIndex(
      (floorItem) => product.i === floorItem.i
    );
    const startPositionX = 0 - listMidpointIndex * 1.5;
    const positionX = startPositionX + orderIndex * 1.5;

    return {
      ...product,
      order: orderIndex,
      position: [positionX, product.position[1] - 0.8, -10] as Vector3Tuple,
    };
  });
};

export const selectedProductRotation: Vector3Tuple = [0, 0, 0.2];

// Carousel layout centered on `selectedId`, in the same state `animateRelatedProducts`
// settles on, so the first render needs no animation.
export const getInitialRelatedProducts = (selectedId: number) => {
  const selected = products[selectedId] ?? products[0];
  return getRelatedProducts({ selected }).map((product) => ({
    ...product,
    rotation:
      product.i === selected.i
        ? selectedProductRotation
        : ([0, 0, 0] as Vector3Tuple),
  }));
};
