"use client";
import {
  products,
  productsApiAtom,
  relatedProductsApiAtom,
} from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { cameraSpringAtom } from "@/state/camera";
import { showAtom } from "@/state/show";
import { useHorizontalDragGestures } from "./hooks/useHorizontalDragGestures";
import { animated, useSprings } from "@react-spring/web";
import { TheRelatedProductsNavigation } from "./components/TheRelatedProductsNavigation";

export default function RelatedProductsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { productId: string };
}) {
  const relatedProductIdRef = useRef(0);

  // const pathname = usePathname();
  // console.log("pathname", pathname);
  // const relatedProductId = Number(useParams().relatedProductId);
  // const relatedProductIdRef = useRef(relatedProductId);
  const { productId } = {
    productId: Number(params.productId),
  };

  // const nextHandler = () => {
  //   const nextId =
  //     relatedProductId === products.length - 1 ? 0 : relatedProductId + 1;

  //   // router.push(`/${productId}/related/${nextId}`);
  // };

  // const prevHandler = () => {
  //   const prevId =
  //     relatedProductId === 0 ? products.length - 1 : relatedProductId - 1;
  //   // router.push(`/${productId}/related/${prevId}`);
  // };

  useEffect(() => {
    return () => console.log("layout unmount");
  });

  return (
    <>
      {/* <div className="absolute text-white bottom-8 sm:bottom-20 w-full">
        <div className=" flex justify-center gap-4"> */}
      <TheRelatedProductsNavigation
        productId={productId}
        relatedProductIdRef={relatedProductIdRef}
      />
      {/* {springs.map((props, i) => {
            if (i === 1)
              return (
                <animated.button
                  style={props}
                  className="cursor-pointer py-4"
                  onClick={prevHandler}
                >
                  <div className="h-1 w-10 rounded-md bg-white"></div>
                </animated.button>
              );
            if (i === 2)
              return (
                <animated.button
                  style={props}
                  className="cursor-default py-4 opacity-100"
                >
                  <div className="h-1 w-10 rounded-md bg-white"></div>
                </animated.button>
              );
            if (i === 3)
              return (
                <animated.button
                  style={props}
                  className="cursor-default py-4 opacity-100"
                  onClick={nextHandler}
                >
                  <div className="h-1 w-10 rounded-md bg-white"></div>
                </animated.button>
              );
          })} */}
      {children}
      {/* <button className="opacity-0 cursor-default" onClick={prevHandler}>
            <div className="h-1 w-10 rounded-md bg-white"></div>
          </button>
          <button
            className=" opacity-40 hover:opacity-100"
            onClick={prevHandler}
          >
            <div className="h-1 w-10 rounded-md bg-white"></div>
          </button>
          <button className="cursor-default">
            <div className="h-1 w-10 rounded-md bg-white"></div>
          </button>
          <button
            className="opacity-40 hover:opacity-100 py-4"
            onClick={nextHandler}
          >
            <div className="h-1 w-10 rounded-md bg-white"></div>
          </button>
          <button className="opacity-0 cursor-default" onClick={prevHandler}>
            <div className="h-1 w-10 rounded-md bg-white"></div>
          </button> */}
      {/* </div>
      </div> */}
    </>
  );
}
