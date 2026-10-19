import Image from "next/image";
import { RightArrowIcon } from "./svgs/RightArrowIcon";

// The landing page without the 3D scene. Nothing is downloaded beyond the still.
// Laid out for a phone: the window first, then the title, then the notice, all
// centred in one column (side by side when the phone is held in landscape).
export function TheMobileLanding() {
  return (
    <div className="absolute z-20 h-dvh w-screen overflow-hidden bg-[#D2BE9D] p-3 sm:p-6">
      <div className="h-full w-full overflow-y-auto bg-[#E8D896]">
        <div className="mx-auto flex min-h-full w-full max-w-xl flex-col items-center justify-center gap-7 px-8 py-8 text-center motion-safe:animate-fade-in landscape:max-w-3xl landscape:flex-row landscape:gap-10 landscape:text-left">
          <div
            className="relative aspect-[560/982] h-[34dvh] max-h-72 shrink-0 overflow-hidden border-2 border-white shadow-[0_24px_48px_-28px_rgba(74,52,38,0.55)] landscape:h-[70dvh]"
            style={{ borderRadius: "5.9% / 3.4%" }}
          >
            <Image
              src="/images/entry-window.jpg"
              alt="The Axis Lounge chair in the showroom"
              fill
              priority
              sizes="160px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center gap-4 landscape:items-start">
            <div className="text-xs uppercase tracking-[0.26em]">
              Chairs <span className="mx-2">|</span> Sofas
            </div>
            <h1 className="font-display text-5xl italic leading-[0.95]">
              Simply
              <br />
              Furnished
            </h1>
            <p className="max-w-xs font-sans text-sm font-light">
              Inspiring spaces start with the right furniture.
            </p>
            <button
              type="button"
              disabled
              className="mt-2 flex h-12 items-center gap-3 rounded-full bg-[#1b1710] px-7 text-xs uppercase tracking-[0.18em] text-[#E8D896] opacity-40"
            >
              Enter showroom
              <RightArrowIcon className="h-4 w-4 [&_path]:stroke-[#E8D896]" />
            </button>
            <p
              role="status"
              className="max-w-xs font-sans text-sm text-[#1b1710]"
            >
              Simply Furnished is a desktop-only site. Visit on a computer to
              enter the showroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
