"use client";
import { TheScrollNavigation } from "@/app/[productId]/components/TheScrollNavigation";
import { ReactNode } from "react";
import TheHomeButton from "./components/TheHomeButton";
import { useVerticalDragGestures } from "./hooks/useVerticalDragGestures";
import { animated, useSpring } from "@react-spring/web";

export default function Layout({ children }: { children: ReactNode }) {
  useVerticalDragGestures();

  const spring = useSpring({
    from: { opacity: 0, y: "4rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 1500,
  });

  return (
    <animated.div style={spring}>
      <TheHomeButton />
      <TheScrollNavigation />
      {/* <TheRelatedProductsNavigation /> */}
      {children}
    </animated.div>
  );
}
