import { useAtomValue, useSetAtom } from "jotai";
import { DisplayItemSpring, springAtom } from "@/state/spring";
import { useSpring } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { MathUtils, Vector3Tuple } from "three";
import { times } from "lodash";
import { animated } from "@react-spring/web";
import { animated as animated3 } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { BarsIcon } from "@/components/svgs/BarsIcon";
import { cursorAtom } from "@/state/cursor";
import { showAtom } from "@/state/show";

const radius = 0.78;
const lineThickness = 0.0035;
const points = times(361, (i) => {
  return [
    Math.sin(-i * (Math.PI / 180)) * radius,
    Math.cos(-i * (Math.PI / 180)) * radius,
    0,
  ];
});

export function RotationSlider({ item }: { item: DisplayItemSpring }) {
  const setCursor = useSetAtom(cursorAtom);
  const spring = useAtomValue(springAtom);
  const [circleSpring, circleApi] = useSpring(() => ({
    rotation: [-2.02, 0, 0],
  }));

  const bind = useDrag(
    ({ down, offset: [mx] }) => {
      circleApi.start({
        rotation: [-2.02, 0, MathUtils.clamp(mx / 1000, -0.5, 0.5)],
        immediate: down,
      });
      spring.wallItems?.current[item.i.get()].start({
        rotation: [0, MathUtils.clamp(mx / 500, -2, 2), 0],
        immediate: down,
      });
    },
    { bounds: { left: -500, right: 500 } }
  );

  return (
    <animated3.group
      position={[0, 0, -0.3]}
      rotation={circleSpring.rotation as unknown as Vector3Tuple}
    >
      <Html position={[0, -0.75, 0]}>
        <animated.button
          className="rounded-full p-2 bg-white rotate-90 cursor-none"
          {...bind()}
          onMouseOver={() => setCursor("pointer")}
          onMouseOut={() => setCursor("default")}
          style={{ opacity: item.sliderOpacity }}
        >
          <BarsIcon className="w-4 h-4" />
        </animated.button>
      </Html>
      <AnimatedCircle
        //@ts-ignore
        points={item.sliderPoints.to((value) => points.slice(0, value))}
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
