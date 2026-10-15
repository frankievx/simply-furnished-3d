import { SpringValues } from "@react-spring/three";
import { Vector3Tuple } from "three";

// Everything that shapes the carousel lives here. The layout is a pure
// function of (item index, active index, item count).
export const carouselLayout = {
  /** Distance between neighbouring items along x. */
  spacing: 1.5,
  y: -1.124315,
  z: -10,
  activeRotation: [0, 0, 0.2] as Vector3Tuple,
  restRotation: [0, 0, 0] as Vector3Tuple,
  /** Milliseconds for a one step move. */
  duration: 1500,
  /** How far past the screen edge an item waits when it wraps round. */
  offscreenMargin: 1.2,
};

export type ItemTarget = {
  position: Vector3Tuple;
  rotation: Vector3Tuple;
};
export type ItemSpring = SpringValues<ItemTarget>;

export const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Signed steps from the active item to `index`, going the short way round the
 * loop. With 8 items the offsets run -4..3, with 3 items -1..1.
 */
export const getOffset = (index: number, activeIndex: number, count: number) => {
  const half = Math.floor(count / 2);
  return mod(index - activeIndex + half, count) - half;
};

export const getItemTarget = (
  index: number,
  activeIndex: number,
  count: number
): ItemTarget => {
  const offset = getOffset(index, activeIndex, count);
  return {
    position: [
      offset * carouselLayout.spacing,
      carouselLayout.y,
      carouselLayout.z,
    ],
    rotation:
      offset === 0 ? carouselLayout.activeRotation : carouselLayout.restRotation,
  };
};

/**
 * True when the short way from `currentX` to `targetX` goes round the loop's
 * seam instead of across the room. Judged from where the item actually is, so
 * it stays right if the user changes direction mid-animation.
 */
export const wrapsAround = (currentX: number, targetX: number, count: number) =>
  Math.abs(targetX - currentX) > (count * carouselLayout.spacing) / 2;
