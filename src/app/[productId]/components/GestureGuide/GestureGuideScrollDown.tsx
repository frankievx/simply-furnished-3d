import { MouseIcon } from "@/app/components/svgs/MouseIcon";
import { MouseScrollIcon } from "@/app/components/svgs/MouseScrollIcon";
import { RightArrowIcon } from "@/app/components/svgs/RightArrowIcon";
import { TapIcon } from "@/app/components/svgs/TapIcon";
import { animated, config, useSpring } from "@react-spring/web";
import { MobileOnlyView, isMobile } from "react-device-detect";

export const GestureGuideScrollDown = () => {
  const spring = useSpring({
    from: {
      y: isMobile ? "5rem" : "-8rem",
    },
    to: async (next) => {
      await next({ y: isMobile ? "-5rem" : "8rem" });
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
          <TapIcon className="w-16 h-16" />
        </animated.div>
        <h2 className="text-xl font-semibold flex-shrink text-center">
          Swipe up to see related products
        </h2>
      </>
    );

  return (
    <>
      <animated.div
        style={spring}
        className="flex-grow flex flex-col justify-center items-center gap-4"
      >
        <MouseIcon className="w-16 h-16" />
        <RightArrowIcon className="w-12 h-12 rotate-90" />
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Scroll down to see product details
      </h2>
    </>
  );
};
