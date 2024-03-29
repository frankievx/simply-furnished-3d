"use client";
import { animated, useSpring } from "@react-spring/web";
import { useGLTF, useProgress } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { TheTitle } from "./TheTitle";

export default function TheLoader({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useState(true);
  const { active, progress, errors, item, loaded, total } = useProgress();

  const [progressSpring, progressApi] = useSpring(
    () => ({
      from: { width: "0%" },
      to: { width: progress.toFixed(2) + "%" },
      config: { duration: 2000 },
      onRest: () => setLoading(false),
    }),
    [progress]
  );

  const containerSpring = useSpring({
    from: {
      opacity: 0,
      y: 300,
    },
    to: {
      opacity: 1,
      y: 0,
    },
    config: { duration: 2000 },
  });

  return (
    <div className=" bg-[#E8D896] h-dvh w-screen flex flex-col justify-center items-center z-20 absolute overflow-hidden">
      <div className="w-1/2 h-1/2 flex justify-center">
        <TheTitle />
      </div>
      <animated.div
        style={containerSpring}
        className="absolute bottom-12 sm:bottom-48  flex flex-col items-center w-1/2 sm:w-1/4"
      >
        {loading ? (
          <>
            <animated.div
              className="h-1 bg-[#D2BE9D] rounded-md "
              style={progressSpring}
            ></animated.div>
            <h1 className="text-lg text-center mt-4">Loading...</h1>
          </>
        ) : (
          <>
            <animated.button
              className="rounded-lg px-5 py-3 bg-[#D2BE9D] w-fit"
              onClick={onClick}
            >
              <RightArrowIcon />
            </animated.button>
          </>
        )}
      </animated.div>
    </div>
  );
}

useGLTF.preload("/models/shelf.glb");
useGLTF.preload("/models/floor.glb");
useGLTF.preload("/models/chair-model.glb");
