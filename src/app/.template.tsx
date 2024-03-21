"use client";
import { ReactNode } from "react";
import { animated, config, useTransition } from "@react-spring/web";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: ReactNode }) {
  console.log("is it working");
  const pathname = usePathname();
  const transitions = useTransition(true, {
    from: { opacity: 1, y: -100 },
    enter: { opacity: 1, config: config.slow, y: 0 },
    leave: { opacity: 0, config: config.slow, y: -100 },
  });
  return transitions((style, data) => (
    <animated.div key={pathname} style={style}>
      {children}
    </animated.div>
  ));
}
