"use client";
import { ReactNode, useEffect, useRef } from "react";
import { TheRelatedProductsNavigation } from "./components/TheRelatedProductsNavigation";

export default function RelatedProductsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { productId: string };
}) {
  const relatedProductIdRef = useRef(0);
  const { productId } = {
    productId: Number(params.productId),
  };

  useEffect(() => {
    return () => console.log("layout unmount");
  });

  return (
    <>
      <TheRelatedProductsNavigation
        productId={productId}
        relatedProductIdRef={relatedProductIdRef}
      />
      {children}
    </>
  );
}
