import { useSpring, animated, config, easings } from "@react-spring/web";

export const ScrollUpIndicator = () => {
  const animateLine = useSpring({
    from: {
      height: "0rem",
    },
    to: {
      height: "2rem",
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
    <>
      <animated.div style={animateEnter}>
        <div className="h-20 w-fit flex flex-col mx-auto justify-end items-center">
          <animated.div
            style={{ ...animateLine }}
            className="w-0.5 bg-white rounded-full flex-initial"
          ></animated.div>
          <div className="text-white tracking-widest text-xs mt-4">DETAILS</div>
        </div>
      </animated.div>

    </>
  );
};
