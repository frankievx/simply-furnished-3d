"use client";
import { relatedProductsApiAtom } from "@/state/products";
import { useAtom, useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { animateRelatedProducts } from "./animations";
import { showAtom } from "@/state/show";
import { useHorizontalDragGestures } from "../hooks/useHorizontalDragGestures";
import { getNextRelatedProductId } from "../../utils/getNextRelatedProductId";
import { getPrevRelatedProductId } from "../../utils/getPrevRelatedProductId";

export default function RelatedProductsPage() {
  const router = useRouter();
  const productId = Number(useParams().productId);
  const relatedProductId = Number(useParams().relatedProductId);
  const relatedProductsApi = useAtomValue(relatedProductsApiAtom);
  const [, setShow] = useAtom(showAtom);

  const nextHandler = () => {
    const nextId = getNextRelatedProductId(relatedProductId);
    router.push(`/${productId}/related/${nextId}`);
  };

  const prevHandler = () => {
    const prevId = getPrevRelatedProductId(relatedProductId);
    router.push(`/${productId}/related/${prevId}`);
  };

  useHorizontalDragGestures({ nextHandler, prevHandler });
  useEffect(() => {
    setShow((show) => ({
      ...show,
      itemTitles: true,
    }));
    if (relatedProductsApi)
      animateRelatedProducts({
        relatedProductsApi,
        product: relatedProductsApi.current[relatedProductId].get(),
      });
  }, [productId]);

  useEffect(() => {
    const prevId = getPrevRelatedProductId(relatedProductId);
    const nextId = getNextRelatedProductId(relatedProductId);
    router.prefetch(`/${productId}/related/${prevId}`);
    router.prefetch(`/${productId}/related/${nextId}`);
  }, []);

  return null;
}
