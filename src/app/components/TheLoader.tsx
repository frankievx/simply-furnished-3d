"use client";
import { animated, useSpring } from "@react-spring/web";
import { useGLTF, useProgress } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";

export default function TheLoader() {
  const [loading, setLoading] = useState(true);
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

  if (!loading) return null;
  return (
    <div className="bg-gradient-to-br from-amber-50 to-[#E8D896] h-screen w-screen flex flex-col justify-center items-center gap-8 z-20 absolute">
      <div className="w-1/2">
        <animated.div className="h-1 bg-black" style={props}></animated.div>
      </div>
      <h1 className="text-lg">Loading...</h1>
    </div>
  );
}

useGLTF.preload("/models/shelf.glb");
useGLTF.preload("/models/floor.glb");
useGLTF.preload("/models/chair-model.glb");
