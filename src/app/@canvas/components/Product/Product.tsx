"use client";
import { animated } from "@react-spring/three";

import { ProductRing } from "./ProductRing";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Shelf } from "../models/Shelf";
import { useCursor } from "@react-three/drei";
import { useState } from "react";
import { Chair } from "../models/Chair";
import { useParams, useRouter } from "next/navigation";
import { ProductSpring, selectedProductAtom } from "@/state/products";
import { ProductRotationSlider } from "./ProductRotationSlider";
import { ProductTitle } from "./ProductTitle";
import { showAtom } from "@/state/show";
import { ProductLandmark } from "./ProductLandmark";
import { Vector3Tuple } from "three";
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

const AnimatedShelf = animated(Shelf);

export default function Product({
  product,
  onClick,
  ...props
}: Omit<JSX.IntrinsicElements["group"], "onClick"> & {
  product: ProductSpring;
  onClick: (product: ProductSpring) => void;
}) {
  const show = useAtomValue(showAtom);
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductAtom);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");

  return (
    <>
      <animated.group
        position={product.position}
        rotation={product.rotation as unknown as Vector3Tuple}
        onClick={(e) => {
          e.stopPropagation();
          onClick(product);
        }}
        onPointerOver={() => {
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        {...props}
      >
        <animated.group
          visible={product.ring}
          position={[0.3, -0.1, 0.75]}
          rotation={[1.57, 0, 0]}
        >
          <ProductLandmark />
        </animated.group>

        <animated.group visible={product.ring}>
          <ProductRing show={!selectedProduct && hovered} />
        </animated.group>
        <animated.group visible={show.itemTitles}>
          <ProductTitle title={product.title.get()} />
        </animated.group>

        {/* <animated.group visible={product.slider}>
          <ProductRotationSlider item={product} />
        </animated.group> */}

        <animated.group
          // position={props.position}
          // rotation={props.rotation as unknown as Vector3Tuple}
          receiveShadow
          castShadow
        >
          <Chair />
          <AnimatedShelf position={product.shelfPosition} />
        </animated.group>
      </animated.group>
    </>
  );
}
