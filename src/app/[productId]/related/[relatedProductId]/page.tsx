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

export default function RelatedProductsPage() {
  const router = useRouter();
  const productId = Number(useParams().productId);
  const relatedProductId = Number(useParams().relatedProductId);
  const sliderApi = useAtomValue(sliderApiAtom);
  const productsApi = useAtom(productsApiAtom);
  const relatedProductsApi = useAtomValue(relatedProductsApiAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);
  const setShow = useSetAtom(showAtom);

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
    setShow((show) => ({ ...show, itemTitles: true }));
    sliderApi.start({
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
  }, [productId, productsApi, cameraSpring]);

  return (
    <>
      <div className="absolute pointer-events-none w-full h-full flex justify-center items-start top-4 sm:top-8">
        <ScrollUpIndicator />
      </div>
    </>
  );
}
