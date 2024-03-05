"use client";
// import { shelfColor } from "@/state/constants";
import {
  animated,
  useSpring,
  useTransition,
  useSpringValue,
} from "@react-spring/three";

import { Vector3, Vector3Tuple } from "three";
import { ProductTitle } from "./ProductTitle/ProductTitle";
import { RotationSlider } from "./RotationSlider/RotationSlider";
import { ProductRing } from "./ProductRing/ProductRing";
// import { ProductSpring, springAtom } from "@/state/spring";
import { useSetAtom } from "jotai";
import { Shelf } from "../models/Shelf";
import { Billboard, useCursor } from "@react-three/drei";
import { memo, useEffect, useMemo, useState } from "react";
import { Chair } from "../models/Chair";
import { config } from "@react-spring/web";
import { useRouter } from "next/navigation";
// import { cursorAtom } from "@/state/cursor";

// type FurnitureProductProps = {
//   obj: any;
//   index: number;
//   springItem: ProductSpring;
//   onClick: ({
//     item,
//     index,
//   }: {
//     item: ProductSpring;
//     index: number;
//   }) => void;
// };

// const MemoProductRing = memo(ProductRing);

export default function Product(
  props: JSX.IntrinsicElements["group"]
  // props: { position: Vector3; rotation: Vector3 } //   {
  //   obj,
  //   index,
  //   springItem,
  //   onClick,
  // }
  // FurnitureProductProps
) {
  // const item = springItem;
  // const setCursor = useSetAtom(cursorAtom);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");
  // const RingComponent = useMemo(
  //   () => <ProductRing show={hovered} />,
  //   [hovered]
  // );

  const onClick = () => {
    router.push("/1");
  };

  return (
    <>
      <animated.group
        {...props}
        onClick={() => onClick()}
        onPointerOver={() => {
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        // visible={item.show}
      >
        <mesh position={[0.3, -0.1, 0.75]} rotation={[1.57, 0, 0]}>
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="white" />
        </mesh>
        <ProductRing show={hovered} />
        {/* <animated.group position={springItem.position}>
          <ProductTitle />
        </animated.group>
        <animated.group position={springItem.position}>
          <RotationSlider item={item} />
        </animated.group> */}
        <animated.group
          // position={props.position}
          // rotation={props.rotation as unknown as Vector3Tuple}
          receiveShadow
          castShadow
        >
          <Chair />
          <Shelf />
        </animated.group>
      </animated.group>
    </>
  );
}
