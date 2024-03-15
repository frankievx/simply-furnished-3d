"use client";
import { productsSpringAtom } from "@/state/products";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { animateCameraToProduct, animateProductToCenter } from "./animations";
import { cameraSpringAtom } from "@/state/camera";

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [productsSpring] = useAtom(productsSpringAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);

  useEffect(() => {
    if (productsSpring && cameraSpring) {
      animateCameraToProduct({
        productId,
        productsSpring,
        cameraSpring,
      }).then(() => {
        animateProductToCenter({
          productId,
          productsSpring,
          cameraSpring,
        });
      });
    }
  }, [productId, productsSpring, cameraSpring]);

  return (
    <main className="fixed flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
