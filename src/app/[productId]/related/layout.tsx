"use client";
import { ReactNode, useEffect, useRef } from "react";
import { TheRelatedProductsNavigation } from "./components/TheRelatedProductsNavigation";
import { animated, useSpring, useTransition } from "@react-spring/web";
import { useShowGestureGuide } from "@/app/hooks/useShowGestureGuide";
import { useHorizontalDragGestures } from "./hooks/useHorizontalDragGestures";
import { useRouter, useParams } from "next/navigation";
import { useAtom, useAtomValue } from "jotai";
import { sliderApiAtom } from "@/state/slider";
import { products, relatedProductsApiAtom } from "@/state/products";
import { showAtom } from "@/state/show";
import { cameraSpringAtom } from "@/state/camera";
import { gestureAtom } from "@/state/gesture";
import {
  animateCameraToRelatedProducts,
  animateRelatedProducts,
} from "./[relatedProductId]/animations";
import { GestureGuideOverlay } from "@/app/components/GestureGuideOverlay";
import { GestureGuideCarousel } from "./[relatedProductId]/components/GestureGuide/GestureGuideCarousel";
import { GestureGuideNav } from "./[relatedProductId]/components/GestureGuide/GestureGuideNav";
import { GestureGuideScrollUp } from "./[relatedProductId]/components/GestureGuide/GestureGuideScrollUp";
import { ScrollUpIndicator } from "../components/ScrollUpIndicator";

export default function RelatedProductsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { productId: string };
}) {
  const router = useRouter();
  const relatedProductId = Number(useParams().relatedProductId);
  const sliderApi = useAtomValue(sliderApiAtom);
  const relatedProductsApi = useAtomValue(relatedProductsApiAtom);
  const [show, setShow] = useAtom(showAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);
  const gesture = useAtomValue(gestureAtom);
  const relatedProductIdRef = useRef(0);
  const { productId } = {
    productId: Number(params.productId),
  };

  const spring = useSpring({
    from: { opacity: 0, y: "6rem" },
    to: { opacity: 1, y: "0rem" },
    delay: 2000,
  });
  useShowGestureGuide();

  return (
    <animated.div style={spring} className="absolute w-full h-full">
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
              setShow((prev) => ({ ...prev, gestureGuide: false }));
            }}
          />
        ) : (
          <ScrollUpIndicator />
        )}
      </div>
      <TheRelatedProductsNavigation
        productId={productId}
        relatedProductIdRef={relatedProductIdRef}
      />
      {children}
    </animated.div>
  );
}
