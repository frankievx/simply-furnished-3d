import { useSpring, animated, easings } from "@react-spring/web";

export const ScrollDownIndicator = () => {
  const animateLine = useSpring({
    from: {
      height: "2rem",
    },
    to: {
      height: "0rem",
    },
    delay: 200,
    config: { duration: 2000, easing: easings.easeInOutCubic },
    loop: true,
  });

  const animateEnter = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <animated.div style={animateEnter}>
      <div className="text-white tracking-widest text-xs">RELATED PRODUCTS</div>
      <div className="h-12 w-fit flex mx-auto items-end">
        <animated.div
          style={{ ...animateLine }}
          className="w-0.5 bg-white rounded-full"
        ></animated.div>
      </div>
    </animated.div>
  );
};
