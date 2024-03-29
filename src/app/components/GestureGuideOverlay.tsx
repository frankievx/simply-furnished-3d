import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { TapIcon } from "@/app/components/svgs/TapIcon";
import { animated, config, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ReactNode, useState } from "react";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { getShowGestureGuide } from "../utils/gestureGuide";
export const GestureGuideOverlay = ({
  pages,
  onDismiss,
}: {
  pages: ReactNode[];
  onDismiss: () => void;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [show, setShow] = useState(getShowGestureGuide());

  const dismissHandler = () => {
    window.localStorage.showGestureGuide = show;
    onDismiss();
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const bind = useDrag(
    ({ swipe }) => {
      if (swipe[0] < 0) {
        if (currentPage < pages.length - 1) setCurrentPage((prev) => prev + 1);
      }

      if (swipe[0] > 0) {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
      }
    },
    {
      swipe: { distance: [5, 5] },
      eventOptions: { capture: true },
      pointer: { capture: true },
    }
  );

  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <animated.div
      style={spring}
      className="absolute h-dvh w-screen flex flex-col justify-center items-center z-30 pointer-events-auto gap-4 sm:gap-8 top-4"
    >
      <div
        {...bind()}
        className="bg-[#D2BE9D] bg-opacity-[0.90] w-3/4 h-3/4 sm:w-1/2 rounded-lg flex flex-col justify-center gap-8 relative"
      >
        <div className="flex-grow text-black flex flex-col justify-between items-center gap-30 px-2">
          {pages[currentPage]}
        </div>
        <div>
          <div className="flex-shrink flex flex-initial justify-between items-center gap-2 py-4 sm:py-8 px-8">
            <button
              onClick={handleBack}
              style={{
                visibility: currentPage > 0 ? "visible" : "hidden",
              }}
            >
              <RightArrowIcon className="w-6 h-6 rotate-180" />
            </button>
            <div className="flex gap-2">
              {pages.map((page, i) => (
                <div
                  key={"gesture-page-" + i}
                  className={`h-2 w-2 rounded full ${
                    currentPage === i ? "bg-white" : "bg-black"
                  }`}
                  onClick={() => setCurrentPage(i)}
                ></div>
              ))}
            </div>
            <button
              onClick={handleNext}
              style={{
                visibility:
                  currentPage < pages.length - 1 ? "visible" : "hidden",
              }}
            >
              <RightArrowIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex justify-center items-center gap-4 mb-4">
            <input
              type="checkbox"
              id="doNotShow"
              className="checked:bg-[#D2BE9D] border-0 rounded"
              checked={!show}
              onChange={() => setShow(!show)}
            />
            <label htmlFor="doNotShow" className="text-xs">
              Do not show this again
            </label>
          </div>
        </div>
      </div>
      <button
        className="flex-shrink text-normal bg-transparent hover:bg-[#D2BE9D] rounded-lg px-3 py-2 "
        onClick={dismissHandler}
      >
        Dismiss
      </button>
    </animated.div>
  );
};
