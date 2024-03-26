"use client";
import { ReactNode, useState } from "react";
import TheLoader from "./TheLoader";
import { useAtomValue } from "jotai";
import { cameraSpringAtom } from "@/state/camera";
import { Vector3Tuple } from "three";
import { animated, useSpring } from "@react-spring/web";

export const TheApp = ({ children }: { children: ReactNode }) => {
  const [enter, setEnter] = useState(false);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [spring, api] = useSpring({ opacity: 1 }, []);
  const enterHandler = () => {
    cameraApi?.set({
      position: [-0.011403, -5.26023, -3] as Vector3Tuple,
      target: [-0.011403, 0, -3.3] as Vector3Tuple,
    });
    api.start({ opacity: 0, onRest: () => setEnter(true) });
    // setEnter(true);
  };
  if (!enter)
    return (
      <animated.div style={spring}>
        <TheLoader onClick={enterHandler} />
      </animated.div>
    );

  return children;
};
