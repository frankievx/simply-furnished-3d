import { CameraSpringRef } from "@/state/camera";

export const animateCameraToRelatedProducts = async ({
  cameraSpring,
}: {
  cameraSpring: CameraSpringRef;
}) => {
  return cameraSpring?.start({
    position: [0, -3.26023, -9],
    target: [0, 0, -9.5],
    config: { duration: 1000 },
  });
};
