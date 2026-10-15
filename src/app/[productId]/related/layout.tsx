"use client";
import { ReactNode, useRef } from "react";
import { TheRelatedProductsNavigation } from "./components/TheRelatedProductsNavigation";
import { animated, useSpring } from "@react-spring/web";

export default function RelatedProductsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { productId: string };
}) {
  const relatedProductIdRef = useRef(0);
  const productId = Number(params.productId);

  const spring = useSpring({
    from: { opacity: 0, y: "6rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 2000,
  });

  return (
    <animated.div style={spring} className="absolute w-full h-full">
      <TheRelatedProductsNavigation
        productId={productId}
        relatedProductIdRef={relatedProductIdRef}
      />
      {children}
    </animated.div>
  );
}
