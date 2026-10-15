"use client";
import { animated } from "@react-spring/three";
import { useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { Suspense, useState } from "react";
import { Vector3Tuple } from "three";
import { ProductData } from "@/data/products";
import { ItemSpring } from "../../carousel";
import { Chair } from "../models/Chair";
import { ProductTitle } from "./ProductTitle";
import { showAtom } from "@/state/show";

export default function Product({
  item,
  spring,
  onClick,
  ...props
}: Omit<JSX.IntrinsicElements["group"], "onClick"> & {
  item: ProductData;
  spring: ItemSpring;
  onClick: (item: ProductData) => void;
}) {
  const show = useAtomValue(showAtom);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");

  return (
    <>
      {/* @ts-ignore */}
      <animated.group
        position={spring.position}
        rotation={spring.rotation as unknown as Vector3Tuple}
        {...props}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        // onClick, not onPointerDown: a drag that starts on a chair must not
        // also select it.
        onClick={(event) => {
          event.stopPropagation();
          onClick(item);
        }}
      >
        <animated.group visible={show.itemTitles}>
          {/* The title loads its font on first show. Without its own boundary
              that suspends the whole canvas and the page flashes white. */}
          <Suspense fallback={null}>
            <ProductTitle title={item.title} />
          </Suspense>
        </animated.group>
        <group receiveShadow castShadow>
          <Chair />
        </group>
      </animated.group>
    </>
  );
}
