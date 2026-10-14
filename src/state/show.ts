import { ExtractAtomValue, atom } from "jotai";

export const showAtom = atom({
  itemTitles: false,
  info: false,
});
export type ShowAtomType = ExtractAtomValue<typeof showAtom>;
