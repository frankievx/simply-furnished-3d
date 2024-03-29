import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { animated, config, useSpring } from "@react-spring/web";

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
};
