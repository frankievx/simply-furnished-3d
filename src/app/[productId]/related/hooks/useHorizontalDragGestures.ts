import { gestureAtom } from "@/state/gesture";
import { useAtom, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const useHorizontalDragGestures = ({
  nextHandler,
  prevHandler,
}: {
  nextHandler: () => void;
  prevHandler: () => void;
}) => {
  const [gesture, setGesture] = useAtom(gestureAtom);
  const touchStart = useRef(0);
  useEffect(() => {
    if (gesture.relatedProducts) {
      const touchStartHandler = (e: TouchEvent) => {
        touchStart.current = e.targetTouches[0].screenX;
      };
      const touchEndHandler = (e: TouchEvent) => {
        const deltaX = e.changedTouches[0].screenX - touchStart.current;
        if (deltaX < -30) {
          touchStart.current = 0;
          nextHandler();
        }
        if (deltaX > 30) {
          touchStart.current = 0;
          prevHandler();
        }
      };
      window.addEventListener("touchstart", touchStartHandler);
      window.addEventListener("touchend", touchEndHandler);
      setGesture((prev) => ({ ...prev, canvas: false }));

      return () => {
        window.removeEventListener("touchstart", touchStartHandler);
        window.removeEventListener("touchend", touchEndHandler);
      };
    }
  }, [gesture.relatedProducts]);
};
