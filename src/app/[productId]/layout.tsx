"use client";
import { TheScrollNavigation } from "@/app/components/TheScrollNavigation";
import { ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TheScrollNavigation />
    </>
  );
}
