"use client";
import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { TheMobileLanding } from "./TheMobileLanding";
import { useIsDesktop } from "@/app/hooks/useIsDesktop";
import { useAtom } from "jotai";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { TheInfoButton } from "./TheInfoButton";
import { TheInfoModal } from "./TheInfoModal";
import { TheCarouselNavigation } from "./TheCarouselNavigation";
import { CarouselController } from "./CarouselController";
import { TheCarouselArrows } from "./TheCarouselArrows";
import { showAtom } from "@/state/show";

// Loaded only on desktop: the module starts downloading every model on import.
const TheLoader = dynamic(() => import("./TheLoader"), { ssr: false });

export const TheApp = ({ children }: { children: ReactNode }) => {
  const isDesktop = useIsDesktop();
  const [enter, setEnter] = useState(false);
  const [spring, api] = useSpring({ opacity: 1 }, []);
  const [show, setShow] = useAtom(showAtom);
  const enterHandler = () => {
    api.start({ opacity: 0, onRest: () => setEnter(true) });
  };

  const transitions = useTransition(show.info, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
  });

  const dismissHandler = () => {
    setShow((show) => ({ ...show, info: false }));
  };

  if (isDesktop === false) return <TheMobileLanding />;
  if (isDesktop === null)
    return <div className="absolute h-dvh w-screen bg-[#D2BE9D]" />;

  if (!enter)
    return (
      <animated.div style={spring}>
        <TheLoader onClick={enterHandler} />
      </animated.div>
    );

  return (
    <main className="absolute pointer-events-none w-full h-dvh bg-transparent">
      <div className="absolute flex justify-between items-end w-full px-3 pointer-events-none bottom-3">
        <TheInfoButton />
      </div>
      <TheCarouselArrows />
      <TheCarouselNavigation />
      <CarouselController />
      {children}
      {transitions(
        (style, show) =>
          show && (
            <animated.div style={style} className="absolute h-full w-full">
              <TheInfoModal onDismiss={dismissHandler} />
            </animated.div>
          )
      )}
    </main>
  );
};
