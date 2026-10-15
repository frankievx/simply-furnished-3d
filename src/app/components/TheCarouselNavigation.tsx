"use client";
import { products } from "@/data/products";
import { mod } from "@/app/@canvas/carousel";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { useEffect, useRef } from "react";
import { animated, useSpring, useSprings } from "@react-spring/web";
import { times } from "lodash";

// Five bars: the current one in the middle, the previous and next either side.
const BAR_COUNT = 5;
const PREV_BAR = 1;
const CURRENT_BAR = 2;
const NEXT_BAR = 3;

export const TheCarouselNavigation = () => {
  const { activeIndex, next, prev } = useCarouselNavigation();
  const previousIndexRef = useRef(activeIndex);

  const navButtons = times(BAR_COUNT, (i) => {
    const navButton = {
      opacity: 0.4,
      className: "cursor-default",
      handler: () => {},
    };
    if (i === PREV_BAR) {
      navButton.handler = prev;
      navButton.className = "cursor-pointer";
    }
    if (i === CURRENT_BAR) navButton.opacity = 1;
    if (i === NEXT_BAR) {
      navButton.handler = next;
      navButton.className = "cursor-pointer";
    }
    return navButton;
  });

  const [containerSpring, containerApi] = useSpring(
    {
      x: "0rem",
      reset: true,
    },
    []
  );

  const [springs, api] = useSprings(
    navButtons.length,
    (i) => ({ opacity: navButtons[i].opacity }),
    [activeIndex]
  );

  useEffect(() => {
    const animateStep = (direction: 1 | -1) => {
      const highlighted = direction === 1 ? NEXT_BAR : PREV_BAR;
      api.start((i) => ({ opacity: i === highlighted ? 1 : 0.4 }));
      containerApi.start({
        x: direction === 1 ? "-3.5rem" : "3.5rem",
        config: { duration: 1500 },
        onRest: () => {
          containerApi.set({ x: "0rem" });
          api.set((i) => ({ opacity: i === CURRENT_BAR ? 1 : 0.4 }));
        },
      });
    };

    const count = products.length;
    const half = Math.floor(count / 2);
    const previous = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    if (activeIndex < 0 || previous < 0 || previous === activeIndex) return;
    // Shortest way round the loop, so wrapping from the last item to the
    // first counts as one step forward.
    const delta = mod(activeIndex - previous + half, count) - half;
    if (delta > 0) animateStep(1);
    else if (delta < 0) animateStep(-1);
  }, [activeIndex, api, containerApi]);

  const fadeIn = useSpring({
    from: { opacity: 0, y: "6rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 2000,
  });

  return (
    <animated.div
      style={fadeIn}
      className="absolute bottom-8 w-full pointer-events-auto text-white sm:bottom-20"
    >
      {/* Mask */}
      <div className="mx-auto w-40 overflow-hidden">
        {/* Container */}
        <animated.div
          style={containerSpring}
          className="flex w-full justify-center gap-4"
        >
          {springs.map((props, i) => (
            <animated.button
              id={"related-nav-button-" + i}
              key={"related-nav-button-" + i}
              style={props}
              className={"py-4 outline-none " + navButtons[i].className}
              onClick={navButtons[i].handler}
            >
              <div className="h-1 w-10 rounded-md bg-white"></div>
            </animated.button>
          ))}
        </animated.div>
      </div>
    </animated.div>
  );
};
