"use client";
import { useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Color, Euler, Mesh, Vector3 } from "three";
import Product from "./components/Product/Product";
import { easings, useSprings } from "@react-spring/web";
import { useAtomValue } from "jotai";
import { carouselCamera } from "@/state/camera";
import { Floor } from "./components/models/Floor";
import { ProductMask } from "./components/Product/ProductMask";
import { products } from "@/data/products";
import { useCarouselNavigation } from "@/app/hooks/carouselNavigation";
import { carouselLayout, getItemTarget, wrapsAround } from "./carousel";
import { Wall } from "./components/models/Wall";
import { Plant } from "./components/models/Plant";
import { WallCarvingArt } from "./components/models/WallCarvingArt";
import { loadingAtom } from "@/state/loading";
import { Bookshelf } from "./components/models/Bookshelf";

const lTarget = new Mesh();
lTarget.position.set(0, 0, -10);

export default function Layout() {
  const { camera } = useThree();
  const getViewport = useThree((state) => state.viewport.getCurrentViewport);
  const loading = useAtomValue(loadingAtom);
  const { activeIndex: urlIndex, goToIndex } = useCarouselNavigation();
  // An unknown id is redirected by the page; show the first item meanwhile.
  const activeIndex = Math.max(urlIndex, 0);
  const count = products.length;

  // One spring per item, laid out around the active item from the first
  // frame, so entering needs no animation.
  const [springs, api] = useSprings(count, (i) =>
    getItemTarget(i, activeIndex, count)
  );

  // The URL is the only source of the active item: whenever it changes, every
  // item retargets from wherever it currently is.
  const springsRef = useRef(springs);
  springsRef.current = springs;
  const previousIndexRef = useRef(activeIndex);
  useEffect(() => {
    if (previousIndexRef.current === activeIndex) return;
    previousIndexRef.current = activeIndex;
    const { duration, spacing, y, z, offscreenMargin } = carouselLayout;
    const visible = getViewport(camera, [0, y, z]);
    const offscreenX = visible.width / 2 + offscreenMargin;
    api.start((i) => {
      const target = getItemTarget(i, activeIndex, count);
      const [targetX] = target.position;
      const [currentX] = springsRef.current[i].position.get();
      if (!wrapsAround(currentX, targetX, count))
        return {
          ...target,
          config: { duration, easing: easings.easeInOutQuad },
        };
      // Crossing the seam: slide off one side, then come in from the other,
      // instead of jumping across the room.
      const exit = currentX < targetX ? -1 : 1;
      const exitX = exit * Math.max(offscreenX, Math.abs(currentX) + spacing);
      const enterX = -exit * Math.max(offscreenX, Math.abs(targetX) + spacing);
      const outDistance = Math.abs(exitX - currentX);
      const inDistance = Math.abs(targetX - enterX);
      const outDuration = (duration * outDistance) / (outDistance + inDistance);
      return {
        to: async (next: (props: object) => Promise<unknown>) => {
          await next({
            position: [exitX, y, z],
            config: { duration: outDuration, easing: easings.easeInQuad },
          });
          await next({ position: [enterX, y, z], immediate: true });
          await next({
            ...target,
            config: {
              duration: duration - outDuration,
              easing: easings.easeOutQuad,
            },
          });
        },
      };
    });
  }, [activeIndex, api, count, camera, getViewport]);

  // The camera is fixed: no intro or transitions, just the carousel view.
  useLayoutEffect(() => {
    camera.position.set(...carouselCamera.position);
    camera.lookAt(new Vector3(...carouselCamera.target));
  }, [camera]);

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
      {springs.map((spring, index) => (
        <Product
          key={products[index].id}
          item={products[index]}
          spring={spring}
          onClick={() => goToIndex(index)}
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
