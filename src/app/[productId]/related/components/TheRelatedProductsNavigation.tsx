"use client";
import { products } from "@/state/products";
import { useParams, useRouter } from "next/navigation";
import { MutableRefObject, useEffect } from "react";
import { useHorizontalDragGestures } from "../hooks/useHorizontalDragGestures";
import { animated, useSpring, useSprings } from "@react-spring/web";
import { times } from "lodash";

export const TheRelatedProductsNavigation = ({
  productId,
  relatedProductIdRef,
}: {
  productId: number;
  relatedProductIdRef: MutableRefObject<number>;
}) => {
  const router = useRouter();
  const relatedProductId = Number(useParams().relatedProductId);

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

  const navButtons = times(5, (i) => {
    const navButton = {
      opacity: 0.4,
      className: "cursor-default",
      handler: () => {},
    };
    if (i === 1) {
      navButton.handler = prevHandler;
      navButton.className = "cursor-pointer";
    }
    if (i === 2) navButton.opacity = 1;
    if (i === 3) {
      navButton.handler = nextHandler;
      navButton.className = "cursor-pointer";
    }
    return navButton;
  });

  const [containerSpring, containerApi] = useSpring(
    {
      x: "0rem",
      reset: true,
    },
    []
  );

  const [springs, api] = useSprings(
    navButtons.length,
    (i) => {
      return {
        opacity: navButtons[i].opacity,
      };
    },
    [relatedProductId]
  );
  useEffect(() => {
    relatedProductIdRef.current = relatedProductId;
  }, []);

  const animateNext = () => {
    api.start((i) => {
      if (i === 3) return { opacity: 1 };
      return { opacity: 0.4 };
    });
    containerApi.start({
      x: "-3.5rem",
      config: { duration: 1500 },
      onRest: () => {
        containerApi.set({ x: "0rem" });
        api.set((i) => {
          if (i === 2) return { opacity: 1 };
          return { opacity: 0.4 };
        });
      },
    });
    relatedProductIdRef.current = relatedProductId;
  };

  const animatePrev = () => {
    api.start((i) => {
      if (i === 1) return { opacity: 1 };
      return { opacity: 0.4 };
    });
    containerApi.start({
      x: "3.5rem",
      config: { duration: 1500 },
      onRest: () => {
        containerApi.set({ x: "0rem" });
        api.set((i) => {
          if (i === 2) return { opacity: 1 };
          return { opacity: 0.4 };
        });
      },
    });
    relatedProductIdRef.current = relatedProductId;
  };

  useEffect(() => {
    if (
      [relatedProductId, relatedProductIdRef.current].includes(0) &&
      [relatedProductId, relatedProductIdRef.current].includes(7)
    ) {
      if (relatedProductIdRef.current === 7 && relatedProductId === 0)
        animateNext();
      if (relatedProductIdRef.current === 0 && relatedProductId === 7)
        animatePrev();
    } else {
      if (relatedProductIdRef.current < relatedProductId) {
        animateNext();
      } else if (relatedProductIdRef.current > relatedProductId) {
        animatePrev();
      }
    }
  }, [relatedProductId]);

  useHorizontalDragGestures({ nextHandler, prevHandler });

  return (
    <>
      <div className="absolute text-white bottom-8 sm:bottom-20 w-full">
        {/* Mask */}
        <div className=" w-40 overflow-hidden mx-auto">
          {/* Container */}
          <animated.div
            style={containerSpring}
            className="flex justify-center w-full gap-4"
          >
            {springs.map((props, i) => {
              return (
                <animated.button
                  id={"related-nav-button-" + i}
                  key={"related-nav-button-" + i}
                  style={props}
                  className={"py-4 outline-none" + navButtons[i].className}
                  onClick={navButtons[i].handler}
                >
                  <div className="h-1 w-10 rounded-md bg-white"></div>
                </animated.button>
              );
            })}
          </animated.div>
        </div>
      </div>
    </>
  );
};
