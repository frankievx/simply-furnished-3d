import Image from "next/image";
import { ReactNode } from "react";

export function TheTitle({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-8 motion-safe:animate-fade-in sm:flex-row sm:justify-center sm:gap-[8vw] sm:px-[6vw]">
      <div className="flex w-full max-w-md flex-col gap-5 sm:gap-8">
        <div className="text-xs uppercase tracking-[0.26em] sm:text-sm">
          Chairs <span className="mx-2">|</span> Sofas
        </div>
        <h1 className="font-display text-6xl italic leading-[0.95] sm:text-7xl lg:text-8xl">
          Simply
          <br />
          Furnished
        </h1>
        <p className="max-w-xs font-sans text-sm font-light sm:text-lg">
          Inspiring spaces start with the right furniture.
        </p>
        {children}
      </div>
      {/* A still of the carousel's own window: the white outline, the chair's
          title and the chair in its room. No 3D is loaded for this. */}
      <div
        className="relative aspect-[560/982] h-[28dvh] shrink-0 overflow-hidden border-2 border-white shadow-[0_24px_48px_-28px_rgba(74,52,38,0.55)] sm:h-[56dvh] sm:max-h-[500px]"
        style={{ borderRadius: "5.9% / 3.4%" }}
      >
        <Image
          src="/images/entry-window.jpg"
          alt="The Axis Lounge chair in the showroom"
          fill
          priority
          sizes="(min-width: 640px) 290px, 160px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
