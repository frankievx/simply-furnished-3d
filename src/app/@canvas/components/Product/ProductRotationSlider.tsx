import { useAtom, useAtomValue, useSetAtom } from "jotai";
// import { DisplayItemSpring, springAtom } from "@/state/spring";
import { useSpring } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { Euler, MathUtils, Vector3Tuple } from "three";
import { times } from "lodash";
import { animated } from "@react-spring/web";
import { animated as animated3 } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { BarsIcon } from "@/app/components/svgs/BarsIcon";
import { productsApiAtom } from "@/state/products";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { sliderApiAtom } from "@/state/slider";
import { dragAtom } from "@/state/drag";
// import { cursorAtom } from "@/state/cursor";
// import { showAtom } from "@/state/show";

const radius = 0.55;
const lineThickness = 0.0035;
const points = times(361, (i) => {
  return [
    Math.sin(-i * (Math.PI / 180)) * radius,
    Math.cos(-i * (Math.PI / 180)) * radius,
    0,
  ];
});

export function ProductRotationSlider() {
  const cancelRef = useRef();
  const productId = Number(useParams().productId);
  const productsApi = useAtomValue(productsApiAtom);
  const drag = useAtomValue(dragAtom);
  const setSliderApi = useSetAtom(sliderApiAtom);
  const [sliderSpring, sliderApi] = useSpring(() => ({
    rotation: [-0.3, 0, 0],
    points: 0,
    opacity: 0,
  }));

  const bind = useDrag(
    ({ down, offset: [mx], cancel }) => {
      sliderApi.start({
        rotation: [-0.3, 0, MathUtils.clamp(mx / 1000, -0.5, 0.5)],
        immediate: down,
      });
      productsApi?.current[productId].start({
        rotation: [0, 0, MathUtils.clamp(mx / 500, -2, 2)],
        immediate: down,
      });
    },
    { bounds: { left: -500, right: 500 }, axis: "x", enabled: drag.product }
  );

  useEffect(() => {
    //@ts-ignore
    if (sliderApi) setSliderApi(() => sliderApi);
  }, [sliderApi]);

  return (
    <animated3.group
      position={[0, -0.6, 0.3]}
      rotation={sliderSpring.rotation as unknown as Vector3Tuple}
    >
      <Html position={[-0.03, -0.5, 0]}>
        <animated.button
          className="rounded-full p-2 bg-white rotate-90 cursor-pointer touch-none shadow-md"
          {...bind()}
          style={{ opacity: sliderSpring?.opacity }}
        >
          <BarsIcon className="w-4 h-4" />
        </animated.button>
      </Html>
      <AnimatedCircle
        //@ts-ignore
        points={sliderSpring.points.to((value) => points.slice(0, value))}
      />
    </animated3.group>
  );
}

const AnimatedCircle = animated3(({ points }: { points: Vector3Tuple[] }) => {
  return (
    <mesh>
      {/*@ts-ignore */}
      <meshLineGeometry points={points} />
      {/*@ts-ignore */}
      <meshLineMaterial lineWidth={lineThickness} color="white" />
    </mesh>
  );
});
