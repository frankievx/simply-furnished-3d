import { dragAtom } from "@/state/drag";
import { useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const useHorizontalDragGestures = ({
  nextHandler,
  prevHandler,
}: {
  nextHandler: () => void;
  prevHandler: () => void;
}) => {
  const setDrag = useSetAtom(dragAtom);
  const touchStart = useRef(0);
  useEffect(() => {
    const touchStartHandler = (e: TouchEvent) => {
      touchStart.current = e.targetTouches[0].screenX;
    };
    const touchEndHandler = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].screenX - touchStart.current;
      if (deltaX < -30) {
        console.log("next");
        touchStart.current = 0;
        nextHandler();
      }
      if (deltaX > 30) {
        console.log("prev");
        touchStart.current = 0;
        prevHandler();
      }
    };
    window.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchend", touchEndHandler);
    setDrag((prev) => ({ ...prev, canvas: false }));

    return () => {
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, []);
};
