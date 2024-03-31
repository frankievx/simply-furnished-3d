"use client";
import { animated, useSpring } from "@react-spring/web";
import { useDrag, useGesture } from "@use-gesture/react";
import { ReactNode, useEffect, useState } from "react";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { ExtractAtomValue, useSetAtom } from "jotai";
import { gestureAtom } from "@/state/gesture";
import mapValues from "lodash/mapValues";

export const GestureGuideOverlay = ({
  pages,
  gestureState,
  onDismiss,
}: {
  pages: ReactNode[];
  gestureState: ExtractAtomValue<typeof gestureAtom>;
  onDismiss: () => void;
}) => {
  const setGesture = useSetAtom(gestureAtom);
  const [currentPage, setCurrentPage] = useState(0);
  const [show, setShow] = useState(false);

  const dismissHandler = () => {
    onDismiss();
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) setCurrentPage((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const gestureBind = useGesture(
    {
      onDrag: ({ swipe }) => {
        if (swipe[0] < 0) {
          if (currentPage < pages.length - 1)
            setCurrentPage((prev) => prev + 1);
        }

        if (swipe[0] > 0) {
          if (currentPage > 0) setCurrentPage((prev) => prev - 1);
        }
      },
      onClick: ({ event }) => event.stopPropagation(),
    },
    {
      drag: {
        swipe: { distance: [5, 5] },
      },
    }
  );

  const spring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    setShow(window.localStorage.showGestureGuide === "true");
    setGesture((gesture) => {
      return mapValues(gesture, () => false);
    });

    return () => setGesture(gestureState);
  }, []);

  useEffect(() => {
    window.localStorage.showGestureGuide = show;
  }, [show]);

  return (
    <animated.div
      style={spring}
      className="absolute h-dvh w-screen flex flex-col justify-center items-center z-30 pointer-events-auto gap-4 sm:gap-8 bg-gray-500 bg-opacity-70"
      onClick={(e) => {
        e.stopPropagation();
        onDismiss();
      }}
    >
      <div
        {...gestureBind()}
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
        className="flex-shrink text-normal bg-transparent hover:bg-[#D2BE9D] rounded-lg px-3 py-2 text-white"
        onClick={dismissHandler}
      >
        Dismiss
      </button>
    </animated.div>
  );
};
