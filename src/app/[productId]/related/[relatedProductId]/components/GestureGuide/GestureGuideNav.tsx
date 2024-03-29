import { ChairIcon } from "@/app/components/svgs/ChairIcon";
import { FingerIcon } from "@/app/components/svgs/FingerIcon";
import { animated } from "@react-spring/web";
import { times } from "lodash";

export const GestureGuideNav = () => {
  return (
    <>
      <animated.div className="flex-grow flex justify-center items-center">
        <div className="relative">
          <div className="border-4 border-solid border-white w-24 h-48 rounded-lg flex items-center justify-center">
            <ChairIcon className="w-16 h-16 stroke-[3]" />
          </div>
          <div className="flex gap-1 justify-center mt-2">
            {times(3, (i) => {
              if (i === 1)
                return <div className="h-1 w-6 bg-white rounded-md"></div>;
              return (
                <div className="h-1 w-6 bg-white opacity-50 rounded-md"></div>
              );
            })}
          </div>
          <animated.div>
            <FingerIcon className="w-16 h-16 fill-black stroke-black stroke-1 absolute -mt-2 ml-12" />
          </animated.div>
        </div>
      </animated.div>
      <h2 className="text-xl font-semibold flex-shrink text-center">
        Or instead, tap the carousel navigation to see the next product.
      </h2>
    </>
  );
};
