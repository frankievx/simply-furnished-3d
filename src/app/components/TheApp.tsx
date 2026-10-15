"use client";
import { ReactNode, useState } from "react";
import TheLoader from "./TheLoader";
import { useAtom } from "jotai";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { TheInfoButton } from "./TheInfoButton";
import { TheInfoModal } from "./TheInfoModal";
import { TheCarouselNavigation } from "./TheCarouselNavigation";
import { CarouselController } from "./CarouselController";
import { showAtom } from "@/state/show";

export const TheApp = ({ children }: { children: ReactNode }) => {
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
