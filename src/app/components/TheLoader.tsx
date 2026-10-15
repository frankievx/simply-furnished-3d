"use client";
import { useGLTF, useProgress, useTexture } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { loadingAtom } from "@/state/loading";
import { imageKitLoader } from "../utils/loader";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { TheTitle } from "./TheTitle";

const BAR_COUNT = 3;
// Matches the bar fill transition below, so the enter button waits for the
// last bar to finish filling.
const FILL_MS = 700;

export default function TheLoader({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useAtom(loadingAtom);
  const { progress } = useProgress();

  useEffect(() => {
    if (progress < 100) return;
    const id = setTimeout(() => setLoading(false), FILL_MS);
    return () => clearTimeout(id);
  }, [progress, setLoading]);

  return (
    <div className="absolute z-20 h-dvh w-screen overflow-hidden bg-[#D2BE9D] p-3 sm:p-6">
      <div className="h-full w-full overflow-hidden bg-[#E8D896]">
        <TheTitle>
          {/* Fixed-height slot: the bars and the button share it, so nothing
              shifts when loading finishes. */}
          <div className="relative h-12 w-full">
            <div
              role="progressbar"
              aria-label="Loading the showroom"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-hidden={!loading}
              className={`absolute inset-0 flex items-center gap-2 transition-opacity duration-500 motion-reduce:transition-none ${
                loading ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {Array.from({ length: BAR_COUNT }, (_, i) => {
                const share = 100 / BAR_COUNT;
                const fill = Math.min(Math.max((progress - i * share) / share, 0), 1);
                return (
                  <div
                    key={i}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-[#1b1710]/15"
                  >
                    <div
                      className="h-full origin-left rounded-full bg-[#1b1710] transition-transform ease-out motion-reduce:transition-none"
                      style={{
                        transform: `scaleX(${fill})`,
                        transitionDuration: `${FILL_MS}ms`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={onClick}
              disabled={loading}
              tabIndex={loading ? -1 : 0}
              className={`absolute left-0 top-0 flex h-12 items-center gap-3 rounded-full bg-[#1b1710] px-7 text-xs uppercase tracking-[0.18em] text-[#E8D896] transition-opacity duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1b1710] motion-reduce:transition-none sm:text-sm ${
                loading ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              Enter showroom
              <RightArrowIcon className="h-4 w-4 [&_path]:stroke-[#E8D896]" />
            </button>
          </div>
        </TheTitle>
      </div>
    </div>
  );
}

useGLTF.preload("/models/bookshelf-opt.glb");
useGLTF.preload("/models/floor.glb");
useGLTF.preload("/models/chair-model-opt.glb");
useGLTF.preload("/models/PlantPalm001/PlantPalm001-opt.glb");
useGLTF.preload("/models/books-opt.glb");
useGLTF.preload("/models/globe-decor.glb");
useGLTF.preload("/models/decorative-stone-opt.glb");
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
