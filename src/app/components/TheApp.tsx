"use client";
import { ReactNode, useState } from "react";
import TheLoader from "./TheLoader";
import { useAtomValue } from "jotai";
import { cameraSpringAtom } from "@/state/camera";
import { Vector3Tuple } from "three";

export const TheApp = ({ children }: { children: ReactNode }) => {
  const [enter, setEnter] = useState(false);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const enterHandler = () => {
    cameraApi?.set({
      position: [-0.011403, -5.26023, -4] as Vector3Tuple,
      target: [-0.011403, 0, -4.5] as Vector3Tuple,
    });
    setEnter(true);
  };
  if (!enter) return <TheLoader onClick={enterHandler} />;
  return children;
};
