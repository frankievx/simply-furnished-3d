"use client";
import { cameraSpringAtom } from "@/state/camera";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { animateProductsToWall } from "./animations";
import { productsAtom, productsSpringAtom } from "@/state/products";

export default function Home() {
  const cameraSpring = useAtomValue(cameraSpringAtom);
  const productsSpring = useAtomValue(productsSpringAtom);
  useEffect(() => {
    cameraSpring?.start({
      position: [-0.011403, -5.26023, 0.9],
      target: [-0.011403, 0, 0.8],
    });
    if (productsSpring) animateProductsToWall({ productsSpring });
  }, [cameraSpring]);
  return (
    <main className="absolute pointer-events-none w-3/4 px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        // style={{ ...style }}
      >
        <div className="flex flex-col gap-16 items-center justify-center h-full">
          <div className="flex justify-center gap-8 sm:text-3xl tracking-widest">
            <div>CHAIRS</div>
            <div>|</div>
            <div>SOFAS</div>
          </div>
          <h1 className="font-casanova italic text-4xl sm:text-7xl ">
            Simply Furnished
          </h1>
          <div className="text-sm text-center sm:text-lg font-extralight font-sans">
            <div>Inspiring spaces start with the right furniture.</div>
            <div>Experience the difference with our handcrafted pieces.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
