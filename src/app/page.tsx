"use client";
import { cameraSpringAtom } from "@/state/camera";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useEffect } from "react";
import { animateProductsToWall } from "./animations";
import { productsAtom, productsApiAtom } from "@/state/products";
import { sliderApiAtom } from "@/state/slider";
import { TheTitle } from "./components/TheTitle";
import { dragAtom } from "@/state/drag";
import { showAtom } from "@/state/show";
import { Vector3Tuple } from "three";

export default function Home() {
  const productsApi = useAtomValue(productsApiAtom);
  const sliderApi = useAtomValue(sliderApiAtom);
  const cameraApi = useAtomValue(cameraSpringAtom);
  const [show, setShow] = useAtom(showAtom);
  useEffect(() => {
    if (show.itemTitles) setShow((show) => ({ ...show, itemTitles: false }));
    if (sliderApi)
      sliderApi.start({ points: 0, opacity: 0, config: { duration: 300 } });
    if (productsApi) animateProductsToWall({ productsApi });

    cameraApi?.start({
      position: [-0.011403, -5.26023, 0.9] as Vector3Tuple,
      target: [-0.011403, 0, 0.8] as Vector3Tuple,
    });
  }, []);

  return (
    <main className="absolute pointer-events-none  w-full sm:w-3/4 px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">
      <div className="flex min-h-screen flex-col items-end justify-end">
        <TheTitle />
      </div>
    </main>
  );
}
