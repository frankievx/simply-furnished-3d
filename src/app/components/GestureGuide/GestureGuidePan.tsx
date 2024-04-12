import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { animated, config, useSpring } from "@react-spring/web";
import { isMobile } from "react-device-detect";
import { CursorIcon } from "../svgs/CursorIcon";

export const GestureGuidePan = () => {
  const spring = useSpring({
    from: {
      x: "-5rem",
      y: "0%",
    },
    to: async (next) => {
      await next({ x: "5rem" });
      await next({ from: { y: "-5rem", x: "0%" }, to: { y: "5rem" } });
      // await next({ opacity: 0 });
    },
    config: {
      ...config.slow,
      tension: 80,
      friction: 50,
    },
    loop: true,
  });
  if (isMobile)
    return (
      <>
        <animated.div
          style={spring}
          className="flex-grow flex justify-center items-center"
        >
          <FingerIcon className="w-16 h-16 fill-black stroke-black stroke-1" />
        </animated.div>
        <h2 className="text-xl font-semibold flex-shrink">Drag to pan</h2>
      </>
    );

  return (
    <>
      <div className="h-full w-full flex justify-center items-center">
        <animated.div
          style={spring}
          className="flex-grow flex justify-center items-center"
        >
          <CursorIcon className="w-16 h-16 fill-black stroke-black stroke-1" />
        </animated.div>
        <div className="absolute w-3/4 h-1/3 border-4 border-solid border-black rounded-lg"></div>
      </div>
      <h2 className="text-xl font-semibold flex-shrink">
        Click and drag to pan
      </h2>
    </>
  );
};
