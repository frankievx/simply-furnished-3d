"use client";
import { ReactNode } from "react";
import { useIsDesktop } from "@/app/hooks/useIsDesktop";

/** Renders its children on desktop only, so phones never start the 3D scene. */
export function DesktopOnly({ children }: { children: ReactNode }) {
  return useIsDesktop() ? <>{children}</> : null;
}
