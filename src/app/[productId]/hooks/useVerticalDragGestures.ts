import { gestureAtom } from "@/state/gesture";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const useVerticalDragGestures = () => {
  const [gesture] = useAtom(gestureAtom);
  const router = useRouter();
  const productId = Number(useParams().productId);
  const touchStart = useRef(0);

  useEffect(() => {
    if (gesture.navigation) {
      const scrollHandler = (e: WheelEvent) => {
        if (e.deltaY > 10) {
          router.push(`/${productId}/related/${productId}`);
        }
        if (e.deltaY < -10) router.push(`/${productId}`);
      };

      const touchStartHandler = (e: TouchEvent) => {
        touchStart.current = e.targetTouches[0].screenY;
      };
      const touchEndHandler = (e: TouchEvent) => {
        const deltaY = e.changedTouches[0].screenY - touchStart.current;
        if (deltaY < -30) {
          touchStart.current = 0;
          router.push(`/${productId}/related/${productId}`);
        }
        if (deltaY > 30) {
          touchStart.current = 0;
          router.push(`/${productId}`);
        }
      };
      window.addEventListener("wheel", scrollHandler);
      window.addEventListener("touchstart", touchStartHandler);
      window.addEventListener("touchend", touchEndHandler);
      return () => {
        window.removeEventListener("wheel", scrollHandler);
        window.removeEventListener("touchstart", touchStartHandler);
        window.removeEventListener("touchend", touchEndHandler);
      };
    }
  }, [gesture.navigation]);
};
