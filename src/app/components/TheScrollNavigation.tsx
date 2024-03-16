"use client";
import { useSpring, animated } from "@react-spring/web";
import { useParams, usePathname, useRouter } from "next/navigation";

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
    <div className="absolute z-10 h-screen right-0">
      <div className="flex h-full flex-col items-center justify-center mr-8">
        <div className="relative w-3 flex flex-col items-center justify-center">
          <animated.div
            style={style}
            className="border border-solid border-white rounded-full h-5 w-5 flex items-center justify-center absolute"
          ></animated.div>
          <button
            className="h-3 w-3 bg-white rounded-full mx-auto mt-1 hover:h-3 hover:w-3 transition-all duration-300 ease-in-out"
            onClick={() => {
              // api.start({ top: "0%", delay: 500 });
              router.push(`/${productId}`);
            }}
          ></button>
          <div className="h-32 w-0.5 rounded-lg bg-white my-4 "></div>
          <button
            className="h-3 w-3 bg-white rounded-full -mb-4 hover:h-3 hover:w-3 transition-all duration-300 ease-in-out"
            onClick={() => {
              // api.start({ top: "100%", delay: 500 });
              // router.push("/related");
              if (productId) router.push(`${productId}/related`);
            }}
          ></button>
          {/* <div className="border border-solid border-white rounded-full h-3 w-3 flex items-center justify-center">
          </div> */}
        </div>
      </div>
    </div>
  );
};
