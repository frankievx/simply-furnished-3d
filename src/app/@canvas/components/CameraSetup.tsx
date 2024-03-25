"use client";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Vector3 } from "three";
const t = new Vector3();
export const CameraSetup = () => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...[-0.011403, -5.26023, -4]);
    camera.lookAt(t.set(...[-0.011403, 0, -5]));
  }, []);
};
