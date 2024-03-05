import { DisplayItemType, displayItems } from "../displayItems";
import { Vector3Tuple } from "three";

export const getCameraDetailPosition = (i: number): Vector3Tuple => {
  return [displayItems[i].position[0], displayItems[i].position[1] + 0.8, 0.9];
};

export const getCameraDetailTarget = (i: number): Vector3Tuple => {
  return [
    displayItems[i].position[0],
    displayItems[i].position[1] + 0.5,
    displayItems[i].position[2],
  ];
};

export const getCameraSelectedPosition = (i: number): Vector3Tuple => {
  const detailPosition = getCameraDetailPosition(i);
  return [detailPosition[0], detailPosition[1], detailPosition[2] + 0.2];
};

export const getCarouselPositionX = (i: number, selected: DisplayItemType) => {
  const totalItems = displayItems.length;
  if (i < selected.i) return selected.position[0] - (i + 1);
  if (i > selected.i) return selected.position[0] + (i - selected.i);
  else return selected.position[0];
};
