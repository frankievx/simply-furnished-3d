import { CameraControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Euler } from "three";

export function CameraControlsWrapper({}: Readonly<{}>) {
  const { camera } = useThree();
  const ref = useRef<typeof CameraControls>();
  // camera.setRotationFromEuler(new Euler(1.5708, 0, 0));
  // console.log("camera", camera);

  useEffect(() => {
    console.log("ref", ref.current);
    if (ref.current) {
      ref.current.rotate(0, 1.5708);
    }
  }, [ref.current, ref.current?.camera]);

  // return null;
  return <CameraControls ref={ref} camera={camera} />;
}
