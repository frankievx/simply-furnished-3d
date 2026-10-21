"use client";
import { products } from "@/data/products";
import { mod } from "@/app/@canvas/carousel";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { RightArrowIcon } from "./svgs/RightArrowIcon";

const pillClass =
  "pointer-events-auto absolute bottom-[4.875rem] flex h-10 cursor-pointer select-none items-center gap-2 rounded-full border border-white/70 px-4 text-sm leading-none text-white transition-colors hover:bg-white hover:text-black active:bg-white/80 active:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-fade-in motion-reduce:transition-none [&_path]:stroke-current";

// Labeled previous and next buttons, either side of the bars. They name the
// neighbouring chair, which also makes the wraparound clear. bottom-[4.875rem]
// centres them on the bars (bars sit at bottom-20, 2.25rem tall).
export function TheCarouselArrows() {
  const { activeIndex, next, prev } = useCarouselNavigation();
  if (activeIndex < 0) return null;
  const count = products.length;
  const prevTitle = products[mod(activeIndex - 1, count)].title;
  const nextTitle = products[mod(activeIndex + 1, count)].title;
  const delay = { animationDelay: "300ms", animationFillMode: "backwards" };
  return (
    <>
      <button
        type="button"
        aria-label={`Previous chair: ${prevTitle}`}
        onClick={prev}
        style={delay}
        className={`${pillClass} right-[calc(50%+6rem)]`}
      >
        <RightArrowIcon className="h-4 w-4 rotate-180" />
        {prevTitle}
      </button>
      <button
        type="button"
        aria-label={`Next chair: ${nextTitle}`}
        onClick={next}
        style={delay}
        className={`${pillClass} left-[calc(50%+6rem)]`}
      >
        {nextTitle}
        <RightArrowIcon className="h-4 w-4" />
      </button>
    </>
  );
}
