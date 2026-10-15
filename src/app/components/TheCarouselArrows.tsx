"use client";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { RightArrowIcon } from "./svgs/RightArrowIcon";

const arrowClass =
  "pointer-events-auto absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-lg transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-fade-in sm:flex";

// Previous and next buttons for desktop. Touch screens use swipe and the bars.
export function TheCarouselArrows() {
  const { next, prev } = useCarouselNavigation();
  const delay = { animationDelay: "2s" };
  return (
    <>
      <button
        type="button"
        aria-label="Previous chair"
        onClick={prev}
        style={delay}
        className={`${arrowClass} left-6`}
      >
        <RightArrowIcon className="h-5 w-5 rotate-180" />
      </button>
      <button
        type="button"
        aria-label="Next chair"
        onClick={next}
        style={delay}
        className={`${arrowClass} right-6`}
      >
        <RightArrowIcon className="h-5 w-5" />
      </button>
    </>
  );
}
