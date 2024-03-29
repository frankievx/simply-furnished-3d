"use client";
import { useSetAtom } from "jotai";
import { showAtom } from "@/state/show";
import { InfoIcon } from "./svgs/InfoIcon";

export const TheInfoButton = () => {
  const setShow = useSetAtom(showAtom);

  const onClick = () => {
    setShow((show) => ({ ...show, info: true, title: false }));
  };
  return (
    <button className="bg-transparent pointer-events-auto" onClick={onClick}>
      <InfoIcon className="fill-white w-8 h-8" />
    </button>
  );
};
