import { TapIcon } from "@/app/components/svgs/TapIcon";
import { animated, config, useSpring } from "@react-spring/web";

export const GestureGuideScrollUp = () => {
  const spring = useSpring({
    from: {
      y: "-5rem",
    },
    to: async (next) => {
      await next({ y: "5rem" });
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
        <TapIcon className="w-16 h-16" />
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Swipe down to see product details
      </h2>
    </>
  );
};
