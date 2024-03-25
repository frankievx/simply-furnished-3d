"use client";
import {
  products,
  productsApiAtom,
  relatedProductsApiAtom,
} from "@/state/products";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { MutableRefObject, useEffect, useRef } from "react";
import { cameraSpringAtom } from "@/state/camera";
import { showAtom } from "@/state/show";
import { useHorizontalDragGestures } from "../hooks/useHorizontalDragGestures";
import { animated, useSprings, useTransition } from "@react-spring/web";

export const TheRelatedProductsNavigation = ({
  productId,
  relatedProductIdRef,
}: {
  productId: number;
  relatedProductIdRef: MutableRefObject<number>;
}) => {
  const router = useRouter();
  // const productId = Number(useParams().productId);
  const relatedProductId = Number(useParams().relatedProductId);
  // const relatedProductIdRef = useRef(relatedProductId);

  const navButtons = [
    {
      opacity: 0,
      handler: () => {
        const prevId =
          relatedProductId === 0 ? products.length - 1 : relatedProductId - 1;
        router.push(`/${productId}/related/${prevId}`);
      },
    },
    {
      opacity: 0.4,
      className: "cursor-pointer",
      handler: () => {
        const prevId =
          relatedProductId === 0 ? products.length - 1 : relatedProductId - 1;
        router.push(`/${productId}/related/${prevId}`);
      },
    },
    {
      opacity: 1,
      className: "cursor-default",
    },
    {
      opacity: 0.4,
      className: "cursor-pointer",
      handler: () => {
        const nextId =
          relatedProductId === products.length - 1 ? 0 : relatedProductId + 1;
        router.push(`/${productId}/related/${nextId}`);
      },
    },
    {
      opacity: 0,
    },
  ];

  // const transitions = useTransition(navButtons, () => {
  //   return
  // });
  const [springs, api] = useSprings(
    5,
    (i) => {
      let opacity = 0.4;

      if (i === 2) {
        opacity = 1;
      }

      if (i === 1 || i === 3) opacity = 0.4;
      relatedProductIdRef.current = relatedProductId;

      return {
        opacity,
        x: "0px",
      };
    },
    []
  );
  useEffect(() => {
    const isPrev =
      (relatedProductIdRef.current === 0 && relatedProductId === 7) ||
      relatedProductId < relatedProductIdRef.current;

    if (isPrev)
      api.start((i) => {
        if (i === 2) return { opacity: 0.4 };
        if (i === 3) return { opacity: 1 };
      });
    // else
    //   api.start((i) => ({
    //     x: "100px",
    //   }));
    return () => console.log("nav unmounting");
  }, [relatedProductId]);

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

  return (
    <>
      <div className="absolute text-white bottom-8 sm:bottom-20 w-full">
        <div className="flex justify-center gap-4 w-40 overflow-hidden mx-auto">
          {springs.map((props, i) => {
            return (
              <animated.button
                key={"related-nav-button-" + i}
                style={props}
                className="cursor-pointer py-4"
                onClick={prevHandler}
              >
                <div className="h-1 w-10 rounded-md bg-white"></div>
              </animated.button>
            );
          })}
        </div>
      </div>
    </>
  );
};
