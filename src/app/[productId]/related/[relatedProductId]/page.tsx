"use client";
import {
  products,
  productsApiAtom,
  relatedProductsApiAtom,
} from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
import { getShowGestureGuide } from "@/app/utils/gestureGuide";

export default function RelatedProductsPage() {
  const router = useRouter();
  const productId = Number(useParams().productId);
  const relatedProductId = Number(useParams().relatedProductId);
  const sliderApi = useAtomValue(sliderApiAtom);
  const relatedProductsApi = useAtomValue(relatedProductsApiAtom);
  const [show, setShow] = useAtom(showAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);

  const nextHandler = () => {
    const nextId =
      relatedProductId === products.length - 1 ? 0 : relatedProductId + 1;

    router.push(`/${productId}/related/${nextId}`);
  };

  const prevHandler = () => {
    const prevId =
      relatedProductId === 0 ? products.length - 1 : relatedProductId - 1;
    router.push(`/${productId}/related/${prevId}`);
  };

  useHorizontalDragGestures({ nextHandler, prevHandler });

  useEffect(() => {
    setShow((show) => ({
      ...show,
      itemTitles: true,
      gestureGuide: getShowGestureGuide(),
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

  return (
    <>
      <div className="absolute pointer-events-none w-full h-full flex justify-center items-start top-4 sm:top-8">
        {show.gestureGuide ? (
          <GestureGuideOverlay
            pages={[
              <GestureGuideCarousel key={"gesture-guide-carousel"} />,
              <GestureGuideNav key="gesture-guide-nav" />,
              <GestureGuideScrollUp key={"gesture-guide-scroll-up"} />,
            ]}
            onDismiss={() =>
              setShow((prev) => ({ ...prev, gestureGuide: false }))
            }
          />
        ) : (
          <ScrollUpIndicator />
        )}
      </div>
    </>
  );
}
