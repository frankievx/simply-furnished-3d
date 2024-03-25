"use client";
import { TheScrollNavigation } from "@/app/[productId]/components/TheScrollNavigation";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useScroll } from "@use-gesture/react";
import TheHomeButton from "./components/TheHomeButton";
import { dragAtom } from "@/state/drag";
import { useSetAtom } from "jotai";
import { useVerticalDragGestures } from "./hooks/useVerticalDragGestures";

export default function Layout({ children }: { children: ReactNode }) {
  useVerticalDragGestures();

  useEffect(() => {
    return () => console.log("higher layout unmount");
  }, []);
  return (
    <>
      <TheHomeButton />
      <TheScrollNavigation />
      {/* <TheRelatedProductsNavigation /> */}
      {children}
    </>
  );
}
