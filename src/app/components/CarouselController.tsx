"use client";
import { showAtom } from "@/state/show";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { products } from "@/data/products";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { useCarouselControls } from "@/app/hooks/useCarouselControls";

// Behaviour that belongs to the carousel page and renders nothing itself.
export function CarouselController() {
  const show = useAtomValue(showAtom);
  const setShow = useSetAtom(showAtom);
  const { next, prev, goToIndex } = useCarouselNavigation();

  useEffect(() => {
    setShow((show) => ({ ...show, itemTitles: true }));
  }, [setShow]);

  // Input is off while the credits modal is open.
  useCarouselControls({
    onNext: next,
    onPrev: prev,
    onFirst: () => goToIndex(0),
    onLast: () => goToIndex(products.length - 1),
    enabled: !show.info,
  });

  return null;
}
