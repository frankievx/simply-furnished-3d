import { animated } from "@react-spring/web";
import { TapIcon } from "../svgs/TapIcon";

export const GestureGuideTap = () => {
  return (
    <>
      <animated.div className="flex-grow flex justify-center items-center">
        <TapIcon className="w-16 h-16" />
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Tap a chair to see details
      </h2>{" "}
    </>
  );
};
