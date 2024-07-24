import { animated } from "@react-spring/web";
import { TapIcon } from "../svgs/TapIcon";
import { isMobile } from "react-device-detect";
import { ChairIcon } from "../svgs/ChairIcon";

export const GestureGuideTap = () => {


  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <animated.div className="relative flex-grow flex justify-center items-center">
          <ChairIcon className="w-28 h-28 stroke-[3]" />
          <TapIcon className="absolute w-12 h-12 ml-2 mt-28" />
        </animated.div>
        <div className="absolute w-3/4 sm:w-1/2 h-1/3 border-4 border-solid border-black rounded-lg"></div>
      </div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        {isMobile
          ? "Tap a chair to see details"
          : "Click a chair to see details"}
      </h2>
    </>
  );
};
