import { SpringRef } from "@react-spring/web";
import { atom } from "jotai";

export const sliderSpringAtom = atom<SliderSpringRef | undefined>(undefined);

export type SliderSpringRef = SpringRef<{
  points: number;
  opacity: number;
}>;
