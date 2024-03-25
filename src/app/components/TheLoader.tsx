"use client";
import { animated, useSpring } from "@react-spring/web";
import { useGLTF, useProgress } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";

export default function TheLoader({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useState(true);
  console.log("loading", loading);
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [props, api] = useSpring(
    () => ({
      from: { width: "0%" },
      to: { width: progress.toFixed(2) + "%" },
      config: { duration: 2000 },
      onRest: () => setLoading(false),
    }),
    [progress]
  );

  return (
    <div className="bg-gradient-to-br from-amber-50 to-[#E8D896] h-screen w-screen flex flex-col justify-center items-center gap-8 z-20 absolute">
      <div className="w-1/2 flex justify-center">
        {loading ? (
          <div className="w-full">
            <animated.div className="h-1 bg-black" style={props}></animated.div>
            <h1 className="text-lg text-center mt-8">Loading...</h1>
          </div>
        ) : (
          <button
            className="rounded-lg px-5 py-3 bg-[#D2BE9D]"
            onClick={onClick}
          >
            {" "}
            Enter{" "}
          </button>
        )}
      </div>
    </div>
  );
}

useGLTF.preload("/models/shelf.glb");
useGLTF.preload("/models/floor.glb");
useGLTF.preload("/models/chair-model.glb");
