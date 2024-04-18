"use client";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  Color,
  Euler,
  MathUtils,
  Mesh,
  Object3D,
  Vector3,
  Vector3Tuple,
} from "three";
import Product from "./components/Product/Product";
import {
  ProductSpring,
  products,
  productsApiAtom,
  relatedProductsApiAtom,
  selectedProductAtom,
} from "../../state/products";
import { easings, useSpring, useSprings } from "@react-spring/web";
import { animated } from "@react-spring/three";
import { useAtomValue, useSetAtom } from "jotai";
import { cameraSpringAtom } from "@/state/camera";
import { Floor } from "./components/models/Floor";
import { useParams, useRouter } from "next/navigation";
import { ProductMask } from "./components/Product/ProductMask";
import { getRelatedProducts } from "./utils";
import { ProductRotationSlider } from "./components/Product/ProductRotationSlider";
import { Vector2, useDrag } from "@use-gesture/react";
import { gestureAtom } from "@/state/gesture";
import { showAtom } from "@/state/show";
import { Wall } from "./components/models/Wall";
import { Plant } from "./components/models/Plant";
import { WallCarvingArt } from "./components/models/WallCarvingArt";
import { useGLTF } from "@react-three/drei";
import { loadingAtom } from "@/state/loading";
import { Plant2 } from "./components/models/Plant2";
import { Plant3 } from "./components/models/Plant3";
import { Bookshelf } from "./components/models/Bookshelf";
import { SideTable } from "./components/models/SideTable";
import { DecorativeBookshelf } from "./components/models/DecorativeBookshelf";
import { HangingShelf } from "./components/models/HangingShelf";
import { PaintingYellow } from "./components/models/PaintingYellow";
import { PaintingFox } from "./components/models/PaintingFox";
import { PaintingYellowRed } from "./components/models/PaintingYellowRed";
import { SnakePlant } from "./components/models/SnakePlant";
import { LemonTree } from "./components/models/LemonTree";
import { WallFlowers } from "./components/models/WallFlowers";
import { GlobeDecor } from "./components/models/GlobeDecor";
import { Clock } from "./components/models/Clock";

const t = new Vector3();
const lightTarget = new Object3D();
const lTarget = new Mesh();
lTarget.position.set(0, 0, -10);
lightTarget.position.set(0, 0, -10);

const relatedProducts = getRelatedProducts({
  selected: products[3],
});

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { camera } = useThree();
  const router = useRouter();
  const { productId } = useParams();
  const loading = useAtomValue(loadingAtom);
  const gesture = useAtomValue(gestureAtom);
  const offsetRef = useRef<Vector2>([0, 0]);
  const setShow = useSetAtom(showAtom);
  const setProductsApi = useSetAtom(productsApiAtom);
  const setRelatedProductsApi = useSetAtom(relatedProductsApiAtom);
  const setCameraSpring = useSetAtom(cameraSpringAtom);

  const [productsSpring, productsApi] = useSprings(products.length, (i) => ({
    ...products[i],
    config: { easing: easings.easeInOutSine },
  }));

  const [relatedProductsSpring, relatedProductsApi] = useSprings(
    relatedProducts.length,
    (i) => {
      return {
        ...relatedProducts[i],
        shelfPosition: [0, 3, -2] as Vector3Tuple,
        config: { easing: easings.easeInOutSine },
      };
    }
  );
  const [, cameraApi] = useSpring(() => ({
    from: {
      position: [-0.011403, -5.26023, -3] as Vector3Tuple,
      target: [-0.011403, 0, -3.3] as Vector3Tuple,
    },
    to: {
      position: [-0.011403, -5.26023, 0.9] as Vector3Tuple,
      target: [-0.011403, 0, 0.8] as Vector3Tuple,
    },
    config: { easing: easings.easeInOutSine, duration: 2000 },
    delay: 300,
    onChange: ({
      value,
    }: {
      value: { position: Vector3Tuple; target: Vector3Tuple };
    }) => {
      camera.position.set(...value.position);
      camera.lookAt(t.set(...value.target));
    },
  }));

  // Enables wall display panning
  const bind = useDrag(
    ({ down, offset: [mx, my] }) => {
      if (down) setShow((show) => ({ ...show, title: false }));
      offsetRef.current = [mx, my];
      cameraApi.start({
        position: [
          MathUtils.clamp(-mx / 100, -5, 5) - 0.011403,
          -5.26023,
          MathUtils.clamp(my / 100, -2, 2) + 0.9,
        ],
        target: [
          MathUtils.clamp(-mx / 100, -5, 5) - 0.011403,
          0,
          MathUtils.clamp(my / 100, -2, 2) + 0.8,
        ] as Vector3Tuple,
        immediate: down,
      });
    },
    {
      bounds: { left: -3000, right: 3000 },
      enabled: gesture.canvas,
      from: () => offsetRef.current,
      // Fixes a bug when clicking a button and "down" gets stuck and forces dragging when the mouse isn't held down.
      // https://github.com/pmndrs/use-gesture/issues/376
      pointer: { capture: false },
    }
  );

  useEffect(() => {
    // Needed to set the initial camera position for no jank on initial camera animation
    setCameraSpring(() => cameraApi);

    products.forEach((product) => {
      router.prefetch(`/${product.i}`);
    });
  }, []);

  useEffect(() => {
    setProductsApi(() => productsApi);
    setRelatedProductsApi(() => relatedProductsApi);
  }, [productsApi, setProductsApi, relatedProductsApi, setRelatedProductsApi]);

  const onProductClick = (product: ProductSpring) => {
    offsetRef.current = [0, 0];
    router.push(`/${product.i.get()}`);
  };

  const onRelatedProductClick = (product: ProductSpring) => {
    router.push(`/${productId}/related/${product.i.get()}`);
  };

  return (
    <>
      <directionalLight
        color={new Color("#FFFFFF")}
        position={[-2.36612, -8.0653, 2.40629]}
        intensity={1.4}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        castShadow
      />
      <hemisphereLight color={new Color("#FFFFFF")} intensity={1} />
      <ProductMask position={[0, -1.85, -9.01]} />
      <animated.group>
        <ProductRotationSlider />
      </animated.group>
      <HangingShelf position={[-1.8, -0.01, 1]} scale={1.8} />
      {/* <Clock position={[-1.8, -0.01, 1.2]} scale={1.8} /> */}
      <PaintingYellow
        position={[1.8, -0.08, -0.1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={3}
      />
      <WallFlowers scale={4} position={[3.5, 0, 1.3]} />
      <WallFlowers scale={4} position={[-0.9, 0, -4.3]} />
      <WallFlowers scale={4} position={[-4, 0, 3.5]} />

      <PaintingFox position={[-4, -0.01, -3]} scale={2} />
      <PaintingYellowRed position={[1, 0, 4.5]} scale={1.5} />
      <DecorativeBookshelf position={[6, -0.01, 1.2]} />
      {/* <HangingShelf position={[1, 0, -1]} scale={1.8} /> */}
      {/* <Bookshelf
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        scale={0.6}
        position={[-1, -0.22, 1.5]}
      /> */}
      {/* {children} */}
      {!loading &&
        productsSpring.map((product, index) => (
          <Product
            key={index}
            product={product}
            onClick={onProductClick}
            castShadow
          />
        ))}
      {relatedProductsSpring.map((product, index) => (
        <Product
          key={index}
          product={product}
          onClick={onRelatedProductClick}
          castShadow
        />
      ))}

      {/* @ts-ignore */}
      <Wall rotation={new Euler(Math.PI / 2, 0, 0)} receiveShadow {...bind()} />
      <directionalLight
        color={new Color("#FFFFFF")}
        position={[-3.36612, -4.0653, -7.40629]}
        intensity={1.5}
        target={lTarget}
        shadow-mapSize={[2048, 2048]}
        shadow-near={0.1}
        shadow-far={2}
        castShadow
      />
      <primitive object={lTarget} />
      {!loading && (
        <group position={[0, 0, -9.985]} receiveShadow>
          <WallCarvingArt />
          <Plant position={[1.8, -0.2, 1]} scale={1.2} />
          <Bookshelf position={[-1.2, -0.1, 0.75]} scale={1.2} />
          <Floor />
        </group>
      )}
    </>
  );
}

