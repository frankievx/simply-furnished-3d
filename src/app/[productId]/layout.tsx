"use client";
import { ReactNode, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useSetAtom } from "jotai";
import { gestureAtom } from "@/state/gesture";

export default function Layout({ children }: { children: ReactNode }) {
  const setGesture = useSetAtom(gestureAtom);
  useEffect(() => {
    setGesture((gesture) => ({ ...gesture, relatedProducts: true }));
  }, [setGesture]);

  const spring = useSpring({
    from: { opacity: 0, y: "4rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 1500,
  });

  return (
    <animated.div style={spring} className="h-dvh w-full absolute">
      {children}
    </animated.div>
  );
}
