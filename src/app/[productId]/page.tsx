"use client";
import { productsSpringAtom } from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { animateCameraToProduct, animateProductToCenter } from "./animations";
import { cameraSpringAtom } from "@/state/camera";
import { sliderSpringAtom } from "@/state/slider";
import { showAtom } from "@/state/show";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const productsSpring = useAtomValue(productsSpringAtom);
  const cameraSpring = useAtomValue(cameraSpringAtom);
  const sliderSpring = useAtomValue(sliderSpringAtom);
  const setShow = useSetAtom(showAtom);

  useEffect(() => {
    if (productsSpring && cameraSpring && sliderSpring) {
      setShow((prev) => ({ ...prev, itemTitles: false }));
      animateCameraToProduct({
        productId,
        productsSpring,
        cameraSpring,
      }).then(() => {
        animateProductToCenter({
          productId,
          productsSpring,
          cameraSpring,
          sliderSpring,
        });
      });
    }
  }, [productId, productsSpring, cameraSpring, sliderSpring]);

  return <></>;
}
