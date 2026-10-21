"use client";
import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { mod } from "@/app/@canvas/carousel";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { RightArrowIcon } from "./svgs/RightArrowIcon";

const pillClass =
  "pointer-events-auto absolute bottom-[4.875rem] h-10 cursor-pointer select-none overflow-hidden rounded-full border border-white/70 text-sm leading-none text-white transition-[color,background-color,width] duration-300 ease-out hover:bg-white hover:text-black active:bg-white/80 active:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-fade-in motion-reduce:transition-none [&_path]:stroke-current";

// A pill whose width follows its content, so it eases to the new width when
// the label changes instead of jumping. CSS can't animate to `auto`, so the
// content is measured and the width set explicitly.
function Pill({
  label,
  onClick,
  className,
  style,
  children,
}: {
  label: string;
  onClick: () => void;
  className: string;
  style: React.CSSProperties;
  children: ReactNode;
}) {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    const measure = () => setWidth(content.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      // +2 for the 1px border either side.
      style={{ ...style, width: width === undefined ? undefined : width + 2 }}
      className={className}
    >
      <span
        ref={contentRef}
        className="inline-flex h-full items-center gap-2 whitespace-nowrap px-4"
      >
        {children}
      </span>
    </button>
  );
}

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
  const titleClass = "motion-safe:animate-fade-in [animation-duration:300ms]";
  return (
    <>
      <Pill
        label={`Previous chair: ${prevTitle}`}
        onClick={prev}
        style={delay}
        className={`${pillClass} right-[calc(50%+6rem)]`}
      >
        <RightArrowIcon className="h-4 w-4 shrink-0 rotate-180" />
        <span key={prevTitle} className={titleClass}>
          {prevTitle}
        </span>
      </Pill>
      <Pill
        label={`Next chair: ${nextTitle}`}
        onClick={next}
        style={delay}
        className={`${pillClass} left-[calc(50%+6rem)]`}
      >
        <span key={nextTitle} className={titleClass}>
          {nextTitle}
        </span>
        <RightArrowIcon className="h-4 w-4 shrink-0" />
      </Pill>
    </>
  );
}
