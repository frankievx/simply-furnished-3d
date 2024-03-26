"use client";
import { useSpring, animated } from "@react-spring/web";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ScrollButton } from "./ScrollButton";

export const TheScrollNavigation = () => {
  const { productId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [style, api] = useSpring(
    () => ({
      to: {
        top: pathname.includes("related") ? "100%" : "0%",
      },
      delay: 500,
    }),
    [pathname]
  );

  return (
    <div className="absolute z-10 h-dvh right-0 pointer-events-auto">
      <div className="flex h-full flex-col items-center justify-center mr-6">
        <div className="relative w-3 flex flex-col items-center justify-center">
          <animated.div
            style={style}
            className="border border-solid border-white rounded-full  h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center absolute"
          ></animated.div>
          <ScrollButton
            className="mt-1"
            onClick={() => {
              console.log("test");
              router.push(`/${productId}`);
            }}
          />
          <div className="h-32 w-0.5 rounded-lg bg-white my-4 "></div>
          <ScrollButton
            className="-mb-3 sm:-mb-4 "
            onClick={() => {
              console.log("working");
              if (productId) router.push(`${productId}/related/${productId}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};
