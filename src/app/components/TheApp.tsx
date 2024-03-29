"use client";
import { ReactNode, useEffect, useState } from "react";
import TheLoader from "./TheLoader";
import { useAtom, useAtomValue } from "jotai";
import { cameraSpringAtom } from "@/state/camera";
import { Vector3Tuple } from "three";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { TheGestureGuideButton } from "./TheGestureGuideButton";
import { TheInfoButton } from "./TheInfoButton";
import { TheInfoModal } from "./TheInfoModal";
import { showAtom } from "@/state/show";

export const TheApp = ({ children }: { children: ReactNode }) => {
  const [enter, setEnter] = useState(false);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [spring, api] = useSpring({ opacity: 1 }, []);
  const [show, setShow] = useAtom(showAtom);
  const enterHandler = () => {
    cameraApi?.set({
      position: [-0.011403, -5.26023, -3] as Vector3Tuple,
      target: [-0.011403, 0, -3.3] as Vector3Tuple,
    });
    api.start({ opacity: 0, onRest: () => setEnter(true) });
  };

  const transitions = useTransition(show.info, {
    from: {
      y: 300,
      opacity: 0,
      z: 100,
    },
    enter: {
      y: 0,
      opacity: 1,
      z: 100,
    },
    leave: {
      y: 100,
      opacity: 0,
      z: 100,
    },
  });

  useEffect(() => {
    if (window.localStorage.showGestureGuide === undefined)
      window.localStorage.showGestureGuide = true;
  }, []);

  if (!enter)
    return (
      <animated.div style={spring}>
        <TheLoader onClick={enterHandler} />
      </animated.div>
    );

  return (
    <>
      <div className="absolute bottom-3 left-3">
        <TheInfoButton />
      </div>
      <div className="absolute bottom-3 right-3">
        <TheGestureGuideButton />
      </div>
      {transitions(
        (style, show) =>
          show && (
            <animated.div style={style} className="z-50">
              <TheInfoModal
                onDismiss={() => setShow((show) => ({ ...show, info: false }))}
              />
            </animated.div>
          )
      )}
      {children}
    </>
  );
};
