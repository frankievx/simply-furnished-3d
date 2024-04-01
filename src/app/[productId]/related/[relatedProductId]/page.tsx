"use client";
import { relatedProductsApiAtom } from "@/state/products";
import { useAtom, useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cameraSpringAtom } from "@/state/camera";
import { animateCameraToRelatedProducts } from "./animations";
import { showAtom } from "@/state/show";
import { animateRelatedProducts } from "./animations";
import { useHorizontalDragGestures } from "../hooks/useHorizontalDragGestures";
import { ScrollUpIndicator } from "../../components/ScrollUpIndicator";
import { sliderApiAtom } from "@/state/slider";
import { GestureGuideOverlay } from "@/app/components/GestureGuideOverlay";
import { GestureGuideCarousel } from "./components/GestureGuide/GestureGuideCarousel";
import { GestureGuideScrollUp } from "./components/GestureGuide/GestureGuideScrollUp";
import { GestureGuideNav } from "./components/GestureGuide/GestureGuideNav";
import { gestureAtom } from "@/state/gesture";
import { getNextRelatedProductId } from "../../utils/getNextRelatedProductId";
import { getPrevRelatedProductId } from "../../utils/getPrevRelatedProductId";

export default function RelatedProductsPage() {
  const router = useRouter();
  const productId = Number(useParams().productId);
  const relatedProductId = Number(useParams().relatedProductId);
  const sliderApi = useAtomValue(sliderApiAtom);
  const relatedProductsApi = useAtomValue(relatedProductsApiAtom);
  const [show, setShow] = useAtom(showAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);
  const gesture = useAtomValue(gestureAtom);

  const nextHandler = () => {
    const nextId = getNextRelatedProductId(relatedProductId);
    router.push(`/${productId}/related/${nextId}`);
  };

  const prevHandler = () => {
    const prevId = getPrevRelatedProductId(relatedProductId);
    router.push(`/${productId}/related/${prevId}`);
  };

  useHorizontalDragGestures({ nextHandler, prevHandler });
  useEffect(() => {
    setShow((show) => ({
      ...show,
      itemTitles: true,
    }));
    sliderApi?.start({
      points: 0,
      opacity: 0,
      config: { duration: 1000 },
    });
    if (relatedProductsApi)
      animateRelatedProducts({
        relatedProductsApi,
        product: relatedProductsApi.current[relatedProductId].get(),
      });
    if (cameraSpring)
      animateCameraToRelatedProducts({ cameraSpring, delay: 500 });
  }, [productId]);

  useEffect(() => {
    const prevId = getPrevRelatedProductId(relatedProductId);
    const nextId = getNextRelatedProductId(relatedProductId);
    router.prefetch(`/${productId}/related/${prevId}`);
    router.prefetch(`/${productId}/related/${nextId}`);
    router.prefetch(`/${relatedProductId}`);
  }, []);

  return (
    <>
      <div className="absolute pointer-events-none w-full h-full flex justify-center items-start">
        {show.gestureGuide ? (
          <GestureGuideOverlay
            gestureState={{
              ...gesture,
              navigation: true,
              canvas: false,
            }}
            pages={[
              <GestureGuideCarousel key={"gesture-guide-carousel"} />,
              <GestureGuideNav key="gesture-guide-nav" />,
              <GestureGuideScrollUp key={"gesture-guide-scroll-up"} />,
            ]}
            onDismiss={() => {
              console.log("dimissed");
              setShow((prev) => ({ ...prev, gestureGuide: false }));
            }}
          />
        ) : (
          <ScrollUpIndicator />
        )}
      </div>
    </>
  );
}
