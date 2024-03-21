"use client";
import { animated } from "@react-spring/three";

import { ProductRing } from "./ProductRing";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Shelf } from "../models/Shelf";
import { useCursor } from "@react-three/drei";
import { useState } from "react";
import { Chair } from "../models/Chair";
import { useParams, useRouter } from "next/navigation";
import {
  ProductSpring,
  productsApiAtom,
  selectedProductAtom,
} from "@/state/products";
import { ProductRotationSlider } from "./ProductRotationSlider";
import { ProductTitle } from "./ProductTitle";
import { showAtom } from "@/state/show";
import { ProductLandmark } from "./ProductLandmark";
import { MathUtils, Vector3Tuple } from "three";
import { useDrag, useGesture } from "@use-gesture/react";
import { sliderApiAtom } from "@/state/slider";

const AnimatedShelf = animated(Shelf);

export default function Product({
  product,
  onClick,
  ...props
}: Omit<JSX.IntrinsicElements["group"], "onClick"> & {
  product: ProductSpring;
  onClick: (product: ProductSpring) => void;
}) {
  const { productId } = useParams();
  const show = useAtomValue(showAtom);
  // const [selectedProduct, setSelectedProduct] = useAtom(selectedProductAtom);
  const productsApi = useAtomValue(productsApiAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const [hovered, setHovered] = useState(false);

  const bind = useGesture(
    {
      onDrag: ({ down, offset: [mx] }) => {
        if (productId) {
          productsApi?.current[Number(productId)].start({
            rotation: [0, 0, MathUtils.clamp(mx / 500, -2, 2)],
            immediate: down,
          });
          sliderApi?.start({
            rotation: [-0.3, 0, MathUtils.clamp(mx / 1000, -0.5, 0.5)],
            immediate: down,
          });
        }
      },
      onPointerOver: () => {
        setHovered(true);
      },
      onPointerOut: () => {
        setHovered(false);
      },
      onPointerDown: ({ event }) => {
        onClick(product);
      },
    },
    { drag: { bounds: { left: -500, right: 500 } } }
  );
  useCursor(hovered, "pointer");

  return (
    <>
      <animated.group
        position={product.position}
        rotation={product.rotation as unknown as Vector3Tuple}
        {...bind()}
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
          <ProductRing show={!productId && hovered} />
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
