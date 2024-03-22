"use client";
import { TheScrollNavigation } from "@/app/[productId]/components/TheScrollNavigation";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDrag, useScroll } from "@use-gesture/react";
import TheHomeButton from "./components/TheHomeButton";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const productId = Number(useParams().productId);
  const touchStart = useRef(0);
  useEffect(() => {
    const scrollHandler = (e: WheelEvent) => {
      if (e.deltaY > 10) {
        router.push(`/${productId}/related`);
      }
      if (e.deltaY < -10) router.push(`/${productId}`);
    };

    const touchStartHandler = (e: TouchEvent) => {
      console.log("e", e);
      touchStart.current = e.targetTouches[0].screenY;
      console.log("touchStart", touchStart);
    };
    const touchEndHandler = (e: TouchEvent) => {
      const deltaY = e.changedTouches[0].screenY - touchStart.current;
      console.log("deltaY", deltaY);
      if (deltaY < -30) {
        touchStart.current = 0;
        router.push(`/${productId}/related`);
      }
      if (deltaY > 30) {
        touchStart.current = 0;
        router.push(`/${productId}`);
      }
    };
    window.addEventListener("wheel", scrollHandler);
    window.addEventListener("touchstart", touchStartHandler);
    window.addEventListener("touchend", touchEndHandler);

    return () => {
      window.removeEventListener("wheel", scrollHandler);
      window.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchend", touchEndHandler);
    };
  }, []);
  return (
    <>
      <TheHomeButton />
      <TheScrollNavigation />
      {children}
    </>
  );
}
