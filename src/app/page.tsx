"use client";
import { cameraSpringAtom } from "@/state/camera";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { animated, useTransition } from "@react-spring/web";
import { animateProductsToWall } from "./animations";
import { productsAtom, productsApiAtom } from "@/state/products";
import { sliderApiAtom } from "@/state/slider";
import { TheTitle } from "./components/TheTitle";
import { dragAtom } from "@/state/drag";
import { showAtom } from "@/state/show";
import { Vector3Tuple } from "three";
import { GestureGuideOverlay } from "./components/GestureGuideOverlay";
import { GestureGuidePan } from "./components/GestureGuide/GestureGuidePan";
import { GestureGuideTap } from "./components/GestureGuide/GestureGuideTap";
import { getShowGestureGuide } from "./utils/gestureGuide";

export default function Home() {
  const productsApi = useAtomValue(productsApiAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [show, setShow] = useAtom(showAtom);
  const setDrag = useSetAtom(dragAtom);
  useEffect(() => {
    setDrag((drag) => ({ ...drag, canvas: true }));
    setShow((show) => ({
      ...show,
      title: true,
      itemTitles: false,
      gestureGuide: getShowGestureGuide(),
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
    // <main className="absolute pointer-events-none  w-full sm:w-3/4 px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">

    <main className="absolute pointer-events-none w-full bg-transparent">
      {show.gestureGuide ? (
        <GestureGuideOverlay
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
