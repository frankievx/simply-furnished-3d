"use client";
import { showAtom } from "@/state/show";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { useHorizontalDragGestures } from "@/app/hooks/useHorizontalDragGestures";

// Behaviour that belongs to the carousel page and renders nothing itself.
export function CarouselController() {
  const show = useAtomValue(showAtom);
  const setShow = useSetAtom(showAtom);
  const { next, prev } = useCarouselNavigation();

  useEffect(() => {
    setShow((show) => ({ ...show, itemTitles: true }));
  }, [setShow]);

  // Swiping is off while the credits modal is open.
  useHorizontalDragGestures({
    onNext: next,
    onPrev: prev,
    enabled: !show.info,
  });

  return null;
}
