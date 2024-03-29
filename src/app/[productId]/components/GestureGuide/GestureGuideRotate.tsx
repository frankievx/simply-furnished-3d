import { BarsIcon } from "@/app/components/svgs/BarsIcon";
import { ChairIcon } from "@/app/components/svgs/ChairIcon";
import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { animated, config, useSpring } from "@react-spring/web";

export const GestureGuideRotate = () => {
  const spring = useSpring({
    from: {
      x: "0rem",
      y: "0%",
    },
    to: async (next) => {
      await next({ x: "5rem", delay: 1000 });
      await next({ x: "-5rem" });
      await next({ x: "0rem" });
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
      x: "0rem",
    },
    to: async (next) => {
      await next({ x: "5rem", delay: 500 });
      await next({ x: "0rem", delay: 500, immediate: true });
      await next({ x: "-5rem" });
      await next({ x: "0rem", delay: 500, immediate: true });
    },
    config: {
      ...config.slow,
      tension: 80,
      friction: 50,
    },
    loop: true,
  });
  return (
    <>
      <animated.div className="flex-grow flex justify-center items-center">
        <div className="relative">
          <ChairIcon className="w-16 h-16 stroke-[3]" />
          <animated.div style={chairDragSpring}>
            <FingerIcon className="w-16 h-16 fill-black stroke-black stroke-1 absolute -mt-7 ml-1" />
          </animated.div>
        </div>
      </animated.div>
      <animated.div
        style={spring}
        className="flex-grow flex justify-center items-center"
      >
        <div className="relative">
          <div className="rounded-full p-2 bg-transparent rotate-90 cursor-pointer touch-none border-black border-[3px]">
            <BarsIcon className="w-6 h-6 stroke-[3]" />
          </div>
          <FingerIcon className="w-16 h-16 fill-black stroke-black stroke-1 absolute -mt-3 ml-1" />
        </div>
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Drag slider or chair horizontally to rotate
      </h2>
    </>
  );
};
