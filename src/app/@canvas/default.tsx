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
import { dragAtom } from "@/state/drag";
// import { useGLTF } from "@react-three/drei";

const t = new Vector3();
const lightTarget = new Object3D();
const lTarget = new Mesh();
lTarget.position.set(0, 0, -10);
lightTarget.position.set(0, 0, -10);

const relatedProducts = getRelatedProducts({
  selected: products[3],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();
  const router = useRouter();
  const { productId } = useParams();
  const drag = useAtomValue(dragAtom);
  const offsetRef = useRef<Vector2>([0, 0]);
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

  const bind = useDrag(
    ({ down, offset: [mx, my] }) => {
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
      enabled: drag.canvas,
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
        position={[-5.36612, -8.0653, 2.40629]}
        intensity={1.4}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
        castShadow
      />
      <hemisphereLight color={new Color("#FFFFFF")} intensity={1.4} />
      <ProductMask position={[0, -1.85, -9.01]} />
      <animated.group>
        <ProductRotationSlider />
      </animated.group>

      {children}

      {productsSpring.map((product, index) => (
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
      <mesh rotation={new Euler(Math.PI / 2, 0, 0)} receiveShadow {...bind()}>
        <meshStandardMaterial color="#FFD468" />
        <planeGeometry args={[25, 20]} />
      </mesh>
      <directionalLight
        color={new Color("#FFFFFF")}
        position={[-3.36612, -4.0653, -7.40629]}
        intensity={1.4}
        target={lTarget}
        shadow-mapSize={[2048, 2048]}
        shadow-near={0.1}
        shadow-far={2}
        castShadow
      />
      <primitive object={lTarget} />
      <group position={[0, 0, -9.985]} receiveShadow>
        <Floor />
      </group>
    </>
  );
}
