import React, { memo, useEffect } from "react";
// import { DisplayItemSpring, springAtom } from "@/state/spring";
// import { config, to, useTransition } from "@react-spring/web";
import { times } from "lodash";
import {
  animated as animated3,
  useSpringValue,
  SpringValue,
} from "@react-spring/three";
import { Color } from "three";

const radius = 0.82;
const lineThickness = 0.01;
const circleColor = new Color("white");
const points = times(362, (i: number) => {
  return [
    Math.sin(-i * (Math.PI / 180)) * radius,
    Math.cos(-i * (Math.PI / 180)) * radius,
    0,
  ];
});

const AnimatedCircle = animated3(({ points }: { points: number[][] }) => {
  // console.log("points", points);
  return (
    <mesh>
      {/*@ts-ignore */}
      <meshLineGeometry points={points} />
      {/*@ts-ignore */}

      <meshLineMaterial lineWidth={lineThickness} color={circleColor} />
    </mesh>
  );
});

export function ProductRing({ show }: { show: boolean }) {
  const spring = useSpringValue(0);

  useEffect(() => {
    if (show) spring.start(361);
    else spring.start(0);
  }, [show]);

  return (
    <animated3.group position={[0, -0.2, 0.3]} rotation={[1.57, 0, 0]}>
      <AnimatedCircle
        //@ts-ignore
        points={spring.to((value) => points.slice(0, value + 1))}
        // opacity={style.opacity}
      />
    </animated3.group>
  );
}
