"use client";
import { animated, useSpring } from "@react-spring/web";
import { useGLTF, useProgress } from "@react-three/drei";
import { Dispatch, SetStateAction, useState } from "react";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { TheTitle } from "./TheTitle";
import { useAtom } from "jotai";
import { loadingAtom } from "@/state/loading";
import { useTexture } from "@react-three/drei";
import { imageKitLoader } from "../utils/loader";

export default function TheLoader({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useAtom(loadingAtom);
  const { active, progress, errors, item, loaded, total } = useProgress();

  const [progressSpring, progressApi] = useSpring(
    () => ({
      from: { width: "0%" },
      to: { width: progress.toFixed(2) + "%" },
      config: { duration: 2000 },
      onRest: () => setLoading(false),
    }),
    [progress]
  );

  const containerSpring = useSpring({
    from: {
      opacity: 0,
      y: 300,
    },
    to: {
      opacity: 1,
      y: 0,
    },
    config: { duration: 2000 },
  });

  return (
    <div className=" bg-[#E8D896] h-dvh w-screen flex flex-col justify-center items-center z-20 absolute overflow-hidden">
      <div className="w-1/2 h-1/2 flex justify-center">
        <TheTitle />
      </div>
      <animated.div
        style={containerSpring}
        className="absolute bottom-12 sm:bottom-48  flex flex-col items-center w-1/2 sm:w-1/4"
      >
        {loading ? (
          <>
            <animated.div
              className="h-1 bg-[#D2BE9D] rounded-md "
              style={progressSpring}
            ></animated.div>
            <h1 className="text-lg text-center mt-4">Loading...</h1>
          </>
        ) : (
          <>
            <animated.button
              className="rounded-lg px-5 py-3 bg-[#D2BE9D] w-fit"
              onClick={onClick}
            >
              <RightArrowIcon />
            </animated.button>
          </>
        )}
      </animated.div>
    </div>
  );
}

useGLTF.preload("/models/shelf.glb");
useGLTF.preload("/models/bookshelf-opt.glb");
useGLTF.preload("/models/hanging-shelf-opt.glb");
useGLTF.preload("/models/floor.glb");
useGLTF.preload("/models/chair-model-opt.glb");
useGLTF.preload("/models/PlantPalm001/PlantPalm001-opt.glb");
useGLTF.preload("/models/wall-flowers-opt.glb");
useGLTF.preload("/models/books-opt.glb");
useGLTF.preload("/models/globe-decor.glb");
useGLTF.preload("/models/painting-fox.glb");
useGLTF.preload("/models/painting-yellow.glb");
useGLTF.preload("/models/painting-yellowred.glb");
useGLTF.preload("/models/decorative-stone-opt.glb");
useGLTF.preload("/models/decorative-bookshelf-opt.glb");
useGLTF.preload("/models/succulent-opt.glb");
useGLTF.preload("/models/small-monstera-opt.glb");
useGLTF.preload("/models/vases-opt.glb");
useGLTF.preload("/models/whale-wicker-basket-opt.glb");
useGLTF.preload("/models/WallCarvingArt.glb");

[
  "/models/PlantPalm001/PlantPalm001_COL_4K_METALNESS.jpg",
  "/models/PlantPalm001/PlantPalm001_NRM_4K_METALNESS.jpg",
  "/models/PlantPalm001/PlantPalm001_ROUGHNESS_4K_METALNESS.jpg",
  "/models/PlantPalm001/PlantPalm001_METALNESS_4K_METALNESS.jpg",
].map((src) => useTexture.preload(imageKitLoader({ src })));
[
  "/models/PlantPalm001/PlantPalmVase001_COL_4K_METALNESS.jpg",
  "/models/PlantPalm001/PlantPalmVase001_NRM_2K_METALNESS.png",
  "/models/PlantPalm001/PlantPalmVase001_ROUGHNESS_4K_METALNESS.jpg",
  "/models/PlantPalm001/PlantPalmVase001_METALNESS_4K_METALNESS.jpg",
].map((src) => useTexture.preload(imageKitLoader({ src })));
[
  "/models/WallCarvingArt/WalledDecoration002_COL_4K_METALNESS.png",
  // "/models/WallCarvingArt/WalledDecoration002_NRM16_4K_LOD0_METALNESS.png",
  "/models/WallCarvingArt/WalledDecoration002_ROUGHNESS_4K_METALNESS.png",
  "/models/WallCarvingArt/WalledDecoration002_METALNESS_4K_METALNESS.png",
  "/models/WallCarvingArt/WalledDecoration002_AO_4K_METALNESS.png",
].map((src) => useTexture.preload(imageKitLoader({ src })));
[
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_COL_4K_METALNESS.png",
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_DISP16_4K_METALNESS.png",
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_NRM_4K_METALNESS.png",
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_ROUGHNESS_4K_METALNESS.png",
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_METALNESS_4K_METALNESS.png",
  "/textures/VeneerWhiteOakRandomMatched001-4K/VeneerWhiteOakRandomMatched001_AO_4K_METALNESS.png",
].map((src) => useTexture.preload(imageKitLoader({ src })));
