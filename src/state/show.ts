import { ExtractAtomValue, atom } from "jotai";

export const showAtom = atom({
  title: true,
  shelf: true,
  details: false,
  cart: false,
  backToHome: false,
  spotlightView: false,
  itemTitles: false,
  rotationSlider: false,
  landmarks: false,
  scrollUpIndicator: false,
  scrollDownIndicator: false,
  gestureGuide: false,
  info: false,
});
export type ShowAtomType = ExtractAtomValue<typeof showAtom>;
