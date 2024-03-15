"use client";
import {
  products,
  productsAtom,
  productsSpringAtom,
  relatedProductsAtom,
  relatedProductsSpringAtom,
} from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Vector3 } from "three";
// import {
//   animateCameraToProduct,
//   animateProductToCenter,
// } from "../@canvas/components/Product/animations";
import { cameraSpringAtom } from "@/state/camera";
import { animateCameraToRelatedProducts } from "./animations";
import { showAtom } from "@/state/show";
import { animateRelatedProducts } from "./animations";

export default function RelatedProductsPage() {
  const { productId } = useParams<{ productId: string }>();
  const [productsSpring] = useAtom(productsSpringAtom);
  const relatedProductsApi = useAtomValue(relatedProductsSpringAtom);
  const [cameraSpring] = useAtom(cameraSpringAtom);
  const setShow = useSetAtom(showAtom);

  useEffect(() => {
    setShow((show) => ({ ...show, itemTitles: true }));
    // const productValues = mapValues(product, (val) => val?.get()) as ProductType;

    if (relatedProductsApi)
      animateRelatedProducts({
        relatedProductsApi,
        product: relatedProductsApi.current[Number(productId)].get(),
        // duration: 0,
      });
    if (cameraSpring)
      animateCameraToRelatedProducts({ cameraSpring, delay: 500 });
  }, [productId, productsSpring, cameraSpring]);

  return (
    <main className="fixed flex min-h-screen flex-col items-center justify-between p-24">
      {/* <div className=" pointer-events-none py-auto px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent">
        <div className="flex flex-col gap-16 items-center justify-center h-full">
          <h1 className="font-casanova italic text-4xl sm:text-7xl ">
            Product
          </h1>
        </div>
      </div> */}
    </main>
  );
}
