"use client";
import { useSetAtom } from "jotai";
import { QuestionIcon } from "./svgs/QuestionIcon";
import { showAtom } from "@/state/show";

export const TheGestureGuideButton = () => {
  const setShow = useSetAtom(showAtom);

  const onClick = () => {
    setShow((show) => ({ ...show, gestureGuide: true }));
  };
  return (
    <button className="bg-transparent pointer-events-auto" onClick={onClick}>
      <QuestionIcon className="fill-white w-8 h-8" />
    </button>
  );
};
