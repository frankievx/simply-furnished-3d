"use client";
import { TheScrollNavigation } from "@/app/components/TheScrollNavigation/";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const productId = Number(useParams().productId);
  // const [scrollRange, setScrollRange] = useState();
  // useEffect(() => {
  //   console.log("scrollRange", scrollRange);
  //   if (scrollRange === 0) {
  //     router.push(`/${productId}`);
  //   }
  //   if (scrollRange === 1) {
  //     router.push(`/${productId}/related`);
  //   }
  // }, [scrollRange]);

  useEffect(() => {
    const scrollHandler = (e: WheelEvent) => {
      if (e.deltaY > 10) {
        router.push(`/${productId}/related`);
      }
      if (e.deltaY < -10) router.push(`/${productId}`);
    };
    window.addEventListener("wheel", scrollHandler);

    return () => {
      window.removeEventListener("wheel", scrollHandler);
    };
  }, []);
  return (
    <>
      <TheScrollNavigation />
      {children}
    </>
  );
}
