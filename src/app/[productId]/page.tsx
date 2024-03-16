"use client";
import { productsSpringAtom } from "@/state/products";
import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { animateCameraToProduct, animateProductToCenter } from "./animations";
import { cameraSpringAtom } from "@/state/camera";
import { sliderSpringAtom } from "@/state/slider";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const productsSpring = useAtomValue(productsSpringAtom);
  const cameraSpring = useAtomValue(cameraSpringAtom);
  const sliderSpring = useAtomValue(sliderSpringAtom);

  useEffect(() => {
    if (productsSpring && cameraSpring && sliderSpring) {
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

  return (
    <></>
    // <main className="fixed flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
