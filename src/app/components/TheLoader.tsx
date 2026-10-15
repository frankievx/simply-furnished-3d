"use client";
import { useGLTF, useProgress, useTexture } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { loadingAtom } from "@/state/loading";
import { imageKitLoader } from "../utils/loader";
import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { TheTitle } from "./TheTitle";

// Every model the carousel needs up front. The same list drives the preloads
// and the progress total.
const PRELOAD_GLBS = [
  "/models/bookshelf-opt.glb",
  "/models/floor.glb",
  "/models/chair-model-opt.glb",
  "/models/PlantPalm001/PlantPalm001-opt.glb",
  "/models/books-opt.glb",
  "/models/globe-decor.glb",
  "/models/decorative-stone-opt.glb",
  "/models/succulent-opt.glb",
  "/models/small-monstera-opt.glb",
  "/models/vases-opt.glb",
  "/models/whale-wicker-basket-opt.glb",
  "/models/WallCarvingArt.glb",
];
PRELOAD_GLBS.forEach((path) => useGLTF.preload(path));

const GLB_SIZES: Record<string, number> = JSON.parse(
  process.env.NEXT_PUBLIC_GLB_SIZES ?? "{}"
);
const TOTAL_BYTES = PRELOAD_GLBS.reduce((n, p) => n + (GLB_SIZES[p] ?? 0), 0);

const BAR_COUNT = 3;
// The bar shown trails the real progress by roughly this long, which smooths
// out bursts of bytes arriving.
const SMOOTHING_SECONDS = 0.5;
// Real progress stops here until every asset has also finished parsing.
const HOLD_PERCENT = 97;
// If the bytes are all in but loading never reports done, finish anyway.
const SETTLE_TIMEOUT_MS = 8000;

type ByteCounts = Record<string, number>;

export default function TheLoader({ onClick }: { onClick: () => void }) {
  const [loading, setLoading] = useAtom(loadingAtom);
  const { progress, active } = useProgress();
  const dreiRef = useRef({ progress, active });
  dreiRef.current = { progress, active };
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const counts = (window as unknown as { __glbBytes?: ByteCounts })
      .__glbBytes;
    let shown = 0;
    let last = performance.now();
    let bytesInAt: number | null = null;
    let raf = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const { progress: loadedItems, active: busy } = dreiRef.current;
      const settled = loadedItems >= 100 && !busy;

      let target: number;
      if (counts && TOTAL_BYTES > 0) {
        let loadedBytes = 0;
        for (const path of PRELOAD_GLBS)
          loadedBytes += Math.min(counts[path] ?? 0, GLB_SIZES[path] ?? 0);
        const fraction = loadedBytes / TOTAL_BYTES;
        if (fraction >= 0.999) bytesInAt ??= now;
        const timedOut = bytesInAt !== null && now - bytesInAt > SETTLE_TIMEOUT_MS;
        target =
          fraction >= 0.99 && (settled || timedOut)
            ? 100
            : Math.min(fraction * 100, HOLD_PERCENT);
      } else {
        // The byte counter is missing, so fall back to loaded item counts.
        target = loadedItems;
      }

      shown = reduceMotion
        ? target
        : shown + (target - shown) * (1 - Math.exp(-dt / SMOOTHING_SECONDS));
      if (target - shown < 0.1) shown = target;

      const share = 100 / BAR_COUNT;
      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const fill = Math.min(Math.max((shown - i * share) / share, 0), 1);
        bar.style.transform = `scaleX(${fill})`;
      });
      barGroupRef.current?.setAttribute("aria-valuenow", String(Math.round(shown)));

      if (shown >= 100) {
        timer = setTimeout(() => setLoading(false), reduceMotion ? 0 : 250);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [setLoading]);

  return (
    <div className="absolute z-20 h-dvh w-screen overflow-hidden bg-[#D2BE9D] p-3 sm:p-6">
      <div className="h-full w-full overflow-hidden bg-[#E8D896]">
        <TheTitle>
          {/* Fixed-height slot: the bars and the button share it, so nothing
              shifts when loading finishes. */}
          <div className="relative h-12 w-full">
            <div
              ref={barGroupRef}
              role="progressbar"
              aria-label="Loading the showroom"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
              aria-hidden={!loading}
              className={`absolute inset-0 flex items-center gap-2 transition-opacity duration-500 motion-reduce:transition-none ${
                loading ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {Array.from({ length: BAR_COUNT }, (_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-[#1b1710]/15"
                >
                  <div
                    ref={(el) => {
                      barRefs.current[i] = el;
                    }}
                    className="h-full origin-left scale-x-0 rounded-full bg-[#1b1710]"
                  />
                </div>
              ))}
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
