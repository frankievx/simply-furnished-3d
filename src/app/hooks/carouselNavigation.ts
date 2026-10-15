"use client";
import { getProductIndex, products } from "@/data/products";
import { mod } from "@/app/@canvas/carousel";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Navigations closer together than this replace the history entry instead of
// adding one, so mashing next does not flood the back button.
const RAPID_MS = 700;
// A requested index counts until the URL catches up, but not for longer.
const PENDING_MS = 2000;

// Shared by every component that navigates, so they agree on what was last
// requested while the URL is still catching up.
let pending: { index: number; at: number } | null = null;
let lastNavigationAt = 0;

/** The active item: the one whose id is in the URL. -1 for an unknown id. */
export function useActiveIndex() {
  const { productId } = useParams<{ productId?: string }>();
  return getProductIndex(productId);
}

export function useCarouselNavigation() {
  const router = useRouter();
  const activeIndex = useActiveIndex();
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  useEffect(() => {
    if (pending && pending.index === activeIndex) pending = null;
  }, [activeIndex]);

  const goToIndex = useCallback(
    (index: number) => {
      const now = Date.now();
      const url = `/${products[index].id}`;
      const rapid = now - lastNavigationAt < RAPID_MS;
      lastNavigationAt = now;
      pending = { index, at: now };
      if (rapid) router.replace(url);
      else router.push(url);
    },
    [router]
  );

  /** Move by `delta` items, counting from the last requested item, so quick
   * repeated clicks add up even before the URL has updated. */
  const step = useCallback(
    (delta: number) => {
      const base =
        pending && Date.now() - pending.at < PENDING_MS
          ? pending.index
          : Math.max(activeIndexRef.current, 0);
      goToIndex(mod(base + delta, products.length));
    },
    [goToIndex]
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  return { activeIndex, goToIndex, next, prev };
}
