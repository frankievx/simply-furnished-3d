import { SpringRef } from "@react-spring/web";
import { Camera } from "@react-three/fiber";
import { atom } from "jotai";
import { Vector3Tuple } from "three";

export const cameraSpringAtom = atom<CameraSpringRef | undefined>(undefined);

export type CameraSpringRef = SpringRef<{
  position: Vector3Tuple;
  target: Vector3Tuple;
}>;
