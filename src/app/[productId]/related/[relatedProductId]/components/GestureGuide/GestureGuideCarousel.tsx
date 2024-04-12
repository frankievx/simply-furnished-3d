import { BarsIcon } from "@/app/components/svgs/BarsIcon";
import { ChairIcon } from "@/app/components/svgs/ChairIcon";
import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { TapIcon } from "@/app/components/svgs/TapIcon";
import { animated, config, useSpring } from "@react-spring/web";
import { isMobile } from "react-device-detect";

export const GestureGuideCarousel = () => {
  console.log("rendering twice");

  const spring = useSpring({
    from: {
      x: "-5rem",
      y: "0%",
    },
    to: async (next) => {
      await next({ x: "5rem", delay: 1000 });
      await next({ x: "-5rem" });
    },
    config: {
      ...config.slow,
      tension: 80,
      friction: 50,
    },
    loop: true,
  });

  const chairDragSpring = useSpring({
    from: {
      x: "-5rem",
    },
    to: async (next) => {
      await next({ x: "5rem" });
      await next({ x: "-5rem" });
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
        <animated.div className="flex-grow flex justify-center items-center">
          <div className="relative">
            <div className="flex">
              <ChairIcon className="w-16 h-16 stroke-[3]" />
              <ChairIcon className="w-16 h-16 stroke-[3]" />
              <ChairIcon className="w-16 h-16 stroke-[3]" />
            </div>
            <animated.div
              className="flex justify-center"
              style={chairDragSpring}
            >
              <FingerIcon className="w-16 h-16 fill-black stroke-black stroke-1 absolute -mt-7 ml-1" />
            </animated.div>
          </div>
        </animated.div>
        <h2 className="text-xl font-semibold flex-shrink text-center">
          Swipe left or right to navigate the related products.
        </h2>
      </>
    );

  return (
    <>
      <animated.div className="flex-grow flex justify-center items-center">
        <div className="relative">
          <div className="flex">
            <ChairIcon className="w-16 h-16 stroke-[3]" />
            <ChairIcon className="w-16 h-16 stroke-[3]" />
            <ChairIcon className="w-16 h-16 stroke-[3]" />
          </div>
          <animated.div className="flex justify-center" style={chairDragSpring}>
            <TapIcon className="w-16 h-16 fill-black stroke-black stroke-1 absolute -mt-7 ml-1" />
          </animated.div>
        </div>
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Click the products left or right to navigate between related products.
      </h2>
    </>
  );
};
