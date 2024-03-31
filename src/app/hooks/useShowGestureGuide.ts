import { showAtom } from "@/state/show";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export const useShowGestureGuide = () => {
  const setShow = useSetAtom(showAtom);
  useEffect(() => {
    console.log("hook effect");
    setShow((show) => ({
      ...show,
      gestureGuide: window.localStorage.showGestureGuide === "true",
    }));
  }, []);
};
