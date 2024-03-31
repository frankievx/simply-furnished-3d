"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import TheLoader from "./TheLoader";
import { useAtom, useAtomValue } from "jotai";
import { cameraSpringAtom } from "@/state/camera";
import { Vector3Tuple } from "three";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { TheGestureGuideButton } from "./TheGestureGuideButton";
import { TheInfoButton } from "./TheInfoButton";
import { TheInfoModal } from "./TheInfoModal";
import { showAtom } from "@/state/show";
import { gestureAtom } from "@/state/gesture";

export const TheApp = ({ children }: { children: ReactNode }) => {
  const [enter, setEnter] = useState(false);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [spring, api] = useSpring({ opacity: 1 }, []);
  const [show, setShow] = useAtom(showAtom);
  const [gesture] = useAtom(gestureAtom);
  const initialGestureStateRef = useRef(gesture);
  const enterHandler = () => {
    cameraApi?.set({
      position: [-0.011403, -5.26023, -3] as Vector3Tuple,
      target: [-0.011403, 0, -3.3] as Vector3Tuple,
    });
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

  useEffect(() => {
    if (window.localStorage.showGestureGuide === undefined)
      window.localStorage.showGestureGuide = true;
  }, []);

  useEffect(() => {
    if (show.info) {
      initialGestureStateRef.current = Object.assign({}, gesture);
    }
  }, [show.info]);

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
        <TheGestureGuideButton />
      </div>
      {children}
      {transitions(
        (style, show) =>
          show && (
            <animated.div style={style} className="absolute h-full w-full">
              <TheInfoModal
                onDismiss={dismissHandler}
                initialGestureState={initialGestureStateRef.current}
              />
            </animated.div>
          )
      )}
    </main>
  );
};
