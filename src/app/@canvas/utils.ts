import { easings } from "@react-spring/web";
import { Vector3Tuple } from "three";
import { ProductType, ProductsType, products } from "@/state/products";

export function getMidpointIndex(products: ProductsType) {
  return Math.round(products.length / 2);
}

export const calculateRelatedProductPositions = ({
  selected,
}: {
  selected: ProductType;
}) => {
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

  const arr = products.map((displayItem, i) => {
    const orderIndex = floorItems.findIndex(
      (floorItem) => displayItem.i === floorItem.i
    );
    const startPositionX = 0 - listMidpointIndex * 1.5;
    const positionX = startPositionX + orderIndex * 1.5;

    return {
      ...displayItem,
      order: orderIndex,
      shelf: false,
      position: [positionX, -12, displayItem.position[2]] as Vector3Tuple,
    };
  });

  return arr;
};
