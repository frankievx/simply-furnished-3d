import { useEffect, useRef } from "react";

const SWIPE_THRESHOLD = 30;

export const useHorizontalDragGestures = ({
  onNext,
  onPrev,
  enabled = true,
}: {
  onNext: () => void;
  onPrev: () => void;
  enabled?: boolean;
}) => {
  const touchStart = useRef(0);
  // Read through a ref so the listeners below never act on stale handlers.
  const handlers = useRef({ onNext, onPrev });
  handlers.current = { onNext, onPrev };

  useEffect(() => {
    if (!enabled) return;
    const touchStartHandler = (e: TouchEvent) => {
      touchStart.current = e.targetTouches[0].screenX;
    };
    const touchEndHandler = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].screenX - touchStart.current;
      if (deltaX < -SWIPE_THRESHOLD) handlers.current.onNext();
      if (deltaX > SWIPE_THRESHOLD) handlers.current.onPrev();
      touchStart.current = 0;
    };
    window.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchend", touchEndHandler);
    return () => {
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, [enabled]);
};
