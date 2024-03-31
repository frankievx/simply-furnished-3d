"use client";
import { cameraSpringAtom } from "@/state/camera";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { animated, useTransition } from "@react-spring/web";
import { animateProductsToWall } from "./animations";
import { productsApiAtom } from "@/state/products";
import { sliderApiAtom } from "@/state/slider";
import { TheTitle } from "./components/TheTitle";
import { showAtom } from "@/state/show";
import { Vector3Tuple } from "three";
import { GestureGuideOverlay } from "./components/GestureGuideOverlay";
import { GestureGuidePan } from "./components/GestureGuide/GestureGuidePan";
import { GestureGuideTap } from "./components/GestureGuide/GestureGuideTap";
import { useShowGestureGuide } from "./hooks/useShowGestureGuide";
import { gestureAtom } from "@/state/gesture";

export default function Home() {
  const productsApi = useAtomValue(productsApiAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [show, setShow] = useAtom(showAtom);
  const [gesture, setGesture] = useAtom(gestureAtom);

  useShowGestureGuide();
  useEffect(() => {
    setGesture((gesture) => ({ ...gesture, canvas: true }));
    setShow((show) => ({
      ...show,
      title: true,
      itemTitles: false,
    }));
    if (sliderApi)
      sliderApi.start({ points: 0, opacity: 0, config: { duration: 300 } });
    if (productsApi) animateProductsToWall({ productsApi });

    cameraApi?.start({
      position: [-0.011403, -5.26023, 0.9] as Vector3Tuple,
      target: [-0.011403, 0, 0.8] as Vector3Tuple,
    });
  }, []);

  const transitions = useTransition(show.title, {
    from: {
      opacity: 0,
      y: 300,
    },
    enter: {
      opacity: 1,
      y: 0,
    },
    leave: {
      opacity: 0,
      y: 100,
    },
  });

  return (
    <main className="absolute pointer-events-none w-full bg-transparent">
      {show.gestureGuide ? (
        <GestureGuideOverlay
          gestureState={{
            ...gesture,
            navigation: false,
            canvas: true,
          }}
          pages={[
            <GestureGuidePan key="gesture-guide-pan" />,
            <GestureGuideTap key="gesture-guide-tap" />,
          ]}
          onDismiss={() =>
            setShow((show) => ({ ...show, gestureGuide: false }))
          }
        />
      ) : (
        <div className="flex h-dvh w-full items-center justify-center">
          {transitions(
            (style, show) =>
              show && (
                <animated.div style={style}>
                  <TheTitle />
                </animated.div>
              )
          )}
        </div>
      )}
    </main>
  );
}
