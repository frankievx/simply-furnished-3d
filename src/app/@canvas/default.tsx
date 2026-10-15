"use client";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { Color, Euler, Mesh, Vector3 } from "three";
import Product from "./components/Product/Product";
import { ProductSpring, relatedProductsApiAtom } from "../../state/products";
import { easings, useSprings } from "@react-spring/web";
import { useAtomValue, useSetAtom } from "jotai";
import { carouselCamera } from "@/state/camera";
import { Floor } from "./components/models/Floor";
import { useParams, useRouter } from "next/navigation";
import { ProductMask } from "./components/Product/ProductMask";
import { getInitialRelatedProducts } from "./utils";
import { Wall } from "./components/models/Wall";
import { Plant } from "./components/models/Plant";
import { WallCarvingArt } from "./components/models/WallCarvingArt";
import { loadingAtom } from "@/state/loading";
import { Bookshelf } from "./components/models/Bookshelf";

const lTarget = new Mesh();
lTarget.position.set(0, 0, -10);

export default function Layout() {
  const { camera } = useThree();
  const router = useRouter();
  const { productId, relatedProductId } = useParams();
  const loading = useAtomValue(loadingAtom);
  const setRelatedProductsApi = useSetAtom(relatedProductsApiAtom);

  // Lay the carousel out around the product in the URL from the first frame.
  const [initialProducts] = useState(() =>
    getInitialRelatedProducts(Number(relatedProductId))
  );
  const [relatedProductsSpring, relatedProductsApi] = useSprings(
    initialProducts.length,
    (i) => ({
      ...initialProducts[i],
      config: { easing: easings.easeInOutSine },
    })
  );

  // The camera is fixed: no intro or transitions, just the carousel view.
  useLayoutEffect(() => {
    camera.position.set(...carouselCamera.position);
    camera.lookAt(new Vector3(...carouselCamera.target));
  }, [camera]);

  useEffect(() => {
    setRelatedProductsApi(() => relatedProductsApi);
  }, [relatedProductsApi, setRelatedProductsApi]);

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
      <Suspense fallback={null}>
        <ProductMask position={[0, -1.85, -9.01]} />
      </Suspense>
      {relatedProductsSpring.map((product, index) => (
        <Product
          key={index}
          product={product}
          onClick={onRelatedProductClick}
          castShadow
        />
      ))}
      <Wall rotation={new Euler(Math.PI / 2, 0, 0)} receiveShadow />
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
        <Suspense fallback={null}>
          <group position={[0, 0, -9.985]} receiveShadow>
            <WallCarvingArt
              position={[1.3, 0, 1.9]}
              rotation={[0, 1.567, 0]}
              scale={1.3}
            />
            <Plant
              position={[1.8, -0.2, 1]}
              rotation={[0, 0, 0.2]}
              scale={1.2}
            />
            <Bookshelf position={[-1.3, -0.1, 0.75]} scale={1.2} />
            <Floor />
          </group>
        </Suspense>
      )}
    </>
  );
}
