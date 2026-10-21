import { showAtom } from "@/state/show";
import { animated } from "@react-spring/web";
import { animated as animated3, useTransition } from "@react-spring/three";
import {
  Billboard,
  Edges,
  Html,
  Mask,
  Outlines,
  Line,
  BillboardProps,
} from "@react-three/drei";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Vector3Tuple,
  Shape,
  BufferGeometry,
  LineBasicMaterial,
  Vector2,
  Euler,
} from "three";
// import { cartAtom } from "@/state/cart";
// import { DisplayItemSpring } from "@/state/spring";
// import { selectedAtom } from "@/state/selected";
import { PlusIcon } from "@/app/components/svgs/PlusIcon";
import { useLayoutEffect, useRef } from "react";
import { GroupProps } from "@react-three/fiber";

const width = 0.8;
const height = 1.4;

const AnimatedLine = animated(Line);

const createRoundedRectShape = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const roundedRectShape = new Shape();
  roundedRectShape.autoClose = true;
  roundedRectShape.moveTo(x, y + radius);
  roundedRectShape.lineTo(x, y + height - radius);
  roundedRectShape.quadraticCurveTo(x, y + height, x + radius, y + height);
  roundedRectShape.lineTo(x + width - radius, y + height);
  roundedRectShape.quadraticCurveTo(
    x + width,
    y + height,
    x + width,
    y + height - radius
  );
  roundedRectShape.lineTo(x + width, y + radius);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width - radius, y);
  roundedRectShape.lineTo(x + radius, y);
  roundedRectShape.quadraticCurveTo(x, y, x, y + radius);
  return roundedRectShape;
};

const createLineShape = (
  shape: Shape,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  s: number
) => {
  const points = shape.getPoints();
  const spacedPoints = shape.getSpacedPoints(50);

  const geometryPoints = new BufferGeometry().setFromPoints(points);
};

const getShapeGeometryPoints = (shape: Shape) => {
  const points = shape.getPoints();
  return new BufferGeometry().setFromPoints(shape.getPoints());
};

const roundedRectShape = createRoundedRectShape(-0.4, -0.98, 0.8, 1.4, 0.05);

const lineGeometry = createLineShape(roundedRectShape, -1, 1, 0, 0, 0, 0, 1);

export function ProductMask(props: BillboardProps & GroupProps) {
  const roundedPlaneRef = useRef(null);
  const [show, setShow] = useAtom(showAtom);
  // const selected = useAtomValue(selectedAtom);
  // const setCart = useSetAtom(cartAtom);
  const transition = useTransition(show.itemTitles, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 800 },
  });

  const clickHandler = () => {
    // if (selected) {
    // setShow((show) => ({ ...show, cart: true }));
    // setCart((cart) => [...cart, selected]);
    // }
  };

  return transition((style, show) => (
    <>
      <Billboard {...props}>
        <Mask id={1}>
          {/*@ts-ignore*/}
          <roundedPlaneGeometry
            args={[width, height, 0.1]}
            ref={roundedPlaneRef}
            position={[0, 0, 0]}
          />
          {show && (
            <>
              <AnimatedLine
                opacity={style.opacity}
                points={roundedRectShape.getPoints()}
                color={"#FFFFFF"}
                lineWidth={2}
                toneMapped={false}
              />
              <Html position={[0, -1, 0]}>
                <animated.button
                  onClick={clickHandler}
                  style={{ opacity: style.opacity }}
                  className="absolute sm:bottom-12 bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-full font-light px-4 py-2 whitespace-nowrap shadow-lg flex items-center gap-6 w-48 hover:bg-gray-100 active:shadow-none active:bg-white text-black"
                >
                  <PlusIcon className="w-5 h-5" />
                  <p>Add To Cart</p>
                </animated.button>
              </Html>
            </>
          )}
        </Mask>
      </Billboard>
    </>
  ));
}
