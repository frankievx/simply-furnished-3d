import { SpringAtomType } from "@/state/spring";
import { displayItems } from "../displayItems";
import { getCarouselPositionX } from "./utils";
import {
  detailCameraPosition,
  detailCameraTarget,
  detailItemPosition,
} from "@/state/constants";
export const animateSelectedToCenter = ({
  spring,
  index,
}: {
  spring: SpringAtomType;
  index: number;
}) => {
  return spring.wallItems?.current[index].start({
    to: async (next) => {
      await next({
        position: detailItemPosition,
        config: { duration: 1000 },
      });
      spring.camera?.start({
        position: detailCameraPosition,
        target: detailCameraTarget,
        config: { duration: 1000 },
      });
    },
  });
};

export const animateWallItemsAwayFromCenter = ({
  spring,
  index,
}: {
  spring: SpringAtomType;
  index: number;
}) => {
  return spring.wallItems?.start((i) => {
    if (index === i) return;
    const selectedPosition = displayItems[index].position;
    const position = displayItems[i].position;

    const outPositionX =
      selectedPosition < position ? position[0] + 10 : position[0] - 10;
    // const carouselPositionX = getCarouselPositionX(i, {
    //   i: index,
    //   position: selectedPosition,
    // });
    return {
      to: async (next) => {
        await next({
          position: [outPositionX, position[1], position[2]],
          config: {
            duration: 1500,
          },
        });
        // await next({
        //   position: [carouselPositionX, -10.3, position[2]],
        //   config: {
        //     duration: 1500,
        //   },
        //   delay: 0,
        // });
      },
    };
  });
};
