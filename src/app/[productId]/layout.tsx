"use client";
import { TheScrollNavigation } from "@/app/[productId]/components/TheScrollNavigation";
import { ReactNode, useEffect, useRef } from "react";
import TheHomeButton from "./components/TheHomeButton";
import { useVerticalDragGestures } from "./hooks/useVerticalDragGestures";
import { animated, useSpring } from "@react-spring/web";
import { useSetAtom } from "jotai";
import { gestureAtom } from "@/state/gesture";

export default function Layout({ children }: { children: ReactNode }) {
  const setGesture = useSetAtom(gestureAtom);
  useEffect(() => {
    setGesture((gesture) => ({
      ...gesture,
      navigation: true,
      relatedProducts: true,
      canvas: false,
    }));
  }, []);
  useVerticalDragGestures();

  const spring = useSpring({
    from: { opacity: 0, y: "4rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 1500,
  });

  return (
    <animated.div style={spring} className="h-dvh w-full absolute">
      <TheHomeButton />
      {/* <TheScrollNavigation /> */}
      {children}
    </animated.div>
  );
}
