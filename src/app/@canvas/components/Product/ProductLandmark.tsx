import { ProductSpring } from "@/state/products";
import { animated } from "@react-spring/three";
export const ProductLandmark = () => {
  return (
    <>
      <mesh>
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </>
  );
};
