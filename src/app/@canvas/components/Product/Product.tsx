"use client";
// import { shelfColor } from "@/state/constants";
import {
  animated,
  useSpring,
  useTransition,
  useSpringValue,
} from "@react-spring/three";

import { Vector3, Vector3Tuple } from "three";
// import { ProductTitle } from "./ProductTitle/ProductTitle";
// import { RotationSlider } from "./RotationSlider/RotationSlider";
import { ProductRing } from "./ProductRing/ProductRing";
// import { ProductSpring, springAtom } from "@/state/spring";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Shelf } from "../models/Shelf";
import { Billboard, useCursor } from "@react-three/drei";
import { memo, useEffect, useMemo, useState } from "react";
import { Chair } from "../models/Chair";
import { useParams, useRouter } from "next/navigation";
import { ProductSpring, selectedProductAtom } from "@/state/products";
import { RotationSlider } from "./RotationSlider/RotationSlider";
import { ProductTitle } from "./ProductTitle/ProductTitle";
import { showAtom } from "@/state/show";
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
  const router = useRouter();
  const { productId } = useParams();
  const show = useAtomValue(showAtom);
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductAtom);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered, "pointer");

  // const onClick = (product: ProductSpring) => {
  //   setSelectedProduct(product);
  //   router.push(`/${product.i.get()}`);
  // };

  return (
    <>
      <animated.group
        position={product.position}
        onClick={() => onClick(product)}
        onPointerOver={() => {
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        {...props}
        // visible={item.show}
      >
        <animated.mesh
          visible={product.ring}
          position={[0.3, -0.1, 0.75]}
          rotation={[1.57, 0, 0]}
        >
          <circleGeometry args={[0.03, 32]} />
          <meshBasicMaterial color="white" />
        </animated.mesh>

        <animated.group visible={product.ring}>
          <ProductRing show={!selectedProduct && hovered} />
        </animated.group>
        {/* <animated.group position={springItem.position}> */}
        <ProductTitle />
        {/* </animated.group> */}

        <animated.group visible={product.slider}>
          <RotationSlider item={product} />
        </animated.group>

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
