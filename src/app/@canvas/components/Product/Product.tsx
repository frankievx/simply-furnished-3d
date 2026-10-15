"use client";
import { animated } from "@react-spring/three";
import { useCursor } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { Suspense, useState } from "react";
import { Vector3Tuple } from "three";
import { Chair } from "../models/Chair";
import { ProductSpring } from "@/state/products";
import { ProductTitle } from "./ProductTitle";
import { showAtom } from "@/state/show";

export default function Product({
  product,
  onClick,
  ...props
}: Omit<JSX.IntrinsicElements["group"], "onClick"> & {
  product: ProductSpring;
  onClick: (product: ProductSpring) => void;
}) {
  const show = useAtomValue(showAtom);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");

  return (
    <>
      {/* @ts-ignore */}
      <animated.group
        position={product.position}
        rotation={product.rotation as unknown as Vector3Tuple}
        {...props}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(event) => {
          event.stopPropagation();
          onClick(product);
        }}
      >
        <animated.group visible={show.itemTitles}>
          {/* The title loads its font on first show. Without its own boundary
              that suspends the whole canvas and the page flashes white. */}
          <Suspense fallback={null}>
            <ProductTitle title={product.title.get()} />
          </Suspense>
        </animated.group>
        <group receiveShadow castShadow>
          <Chair />
        </group>
      </animated.group>
    </>
  );
}
