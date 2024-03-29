"use client";
import { productsApiAtom } from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { animateCameraToProduct, animateProductToCenter } from "./animations";
import { cameraSpringAtom } from "@/state/camera";
import { sliderApiAtom } from "@/state/slider";
import { showAtom } from "@/state/show";
import { dragAtom } from "@/state/drag";
import { ScrollDownIndicator } from "./components/ScrollDownIndicator";
import { GestureGuideOverlay } from "../components/GestureGuideOverlay";
import { GestureGuideRotate } from "./components/GestureGuide/GestureGuideRotate";
import { GestureGuideScrollDown } from "./components/GestureGuide/GestureGuideScrollDown";
import { getShowGestureGuide } from "../utils/gestureGuide";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const productsApi = useAtomValue(productsApiAtom);
  const cameraSpring = useAtomValue(cameraSpringAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const [show, setShow] = useAtom(showAtom);
  const setDrag = useSetAtom(dragAtom);

  useEffect(() => {
    if (productsApi && cameraSpring && sliderApi) {
      console.log("getShowGestureGuide()", getShowGestureGuide());
      setShow((prev) => ({
        ...prev,
        itemTitles: false,
        gestureGuide: getShowGestureGuide(),
      }));
      setDrag((prev) => ({ ...prev, product: true }));
      animateCameraToProduct({
        productId,
        productsApi,
        cameraSpring,
      }).then(() => {
        animateProductToCenter({
          productId,
          productsApi,
          cameraSpring,
          sliderApi,
        });
      });
      return () => {
        sliderApi.start({ rotation: [-0.3, 0, 0] });
      };
    }
  }, [productId, productsApi, cameraSpring, sliderApi]);

  return (
    <div className="absolute pointer-events-none w-full h-full flex justify-center items-end">
      {show.gestureGuide ? (
        <GestureGuideOverlay
          pages={[
            <GestureGuideRotate key={"gesture-guide-rotate"} />,
            <GestureGuideScrollDown key={"gesture-guide-scroll-down"} />,
          ]}
          onDismiss={() =>
            setShow((prev) => ({ ...prev, gestureGuide: false }))
          }
        />
      ) : (
        <div className="absolute bottom-12">
          <ScrollDownIndicator />
        </div>
      )}
    </div>
  );
}
