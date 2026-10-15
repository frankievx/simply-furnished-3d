import { RightArrowIcon } from "./svgs/RightArrowIcon";
import { TheTitle } from "./TheTitle";

// The landing page without the 3D scene. Nothing is downloaded beyond the still.
export function TheMobileLanding() {
  return (
    <div className="absolute z-20 h-dvh w-screen overflow-hidden bg-[#D2BE9D] p-3 sm:p-6">
      <div className="h-full w-full overflow-hidden bg-[#E8D896]">
        <TheTitle>
          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              disabled
              className="flex h-12 items-center gap-3 self-start rounded-full bg-[#1b1710] px-7 text-xs uppercase tracking-[0.18em] text-[#E8D896] opacity-40 sm:text-sm"
            >
              Enter showroom
              <RightArrowIcon className="h-4 w-4 [&_path]:stroke-[#E8D896]" />
            </button>
            <p role="status" className="font-sans text-sm text-[#1b1710]">
              Simply Furnished is a desktop-only site. Visit on a computer to
              enter the showroom.
            </p>
          </div>
        </TheTitle>
      </div>
    </div>
  );
}
