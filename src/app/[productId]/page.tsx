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

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const productsApi = useAtomValue(productsApiAtom);
  const cameraSpring = useAtomValue(cameraSpringAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const setShow = useSetAtom(showAtom);
  const setDrag = useSetAtom(dragAtom);

  useEffect(() => {
    if (productsApi && cameraSpring && sliderApi) {
      setShow((prev) => ({ ...prev, itemTitles: false }));
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
    <div className="absolute pointer-events-none w-full h-full flex justify-center items-end bottom-12">
      <ScrollDownIndicator />
    </div>
  );
}
