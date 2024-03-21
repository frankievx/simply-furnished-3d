import { SpringRef } from "@react-spring/web";
import { atom } from "jotai";
import { Vector3Tuple } from "three";

export const sliderApiAtom = atom<SliderApiRef | undefined>(undefined);

export type SliderApiRef = SpringRef<{
  rotation: Vector3Tuple;
  points: number;
  opacity: number;
}>;
