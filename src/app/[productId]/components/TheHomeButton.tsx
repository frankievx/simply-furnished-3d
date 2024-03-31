"use client";
import { HomeIcon } from "@/app/components/svgs/HomeIcon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TheHomeButton() {
  const router = useRouter();

  return (
    <button
      className="absolute hover:border-1 border-[#B2947C] bg-[#D2BE9D] left-4 top-4 rounded-md px-2 py-2 outline-none shadow-md pointer-events-auto"
      onClick={(e) => {
        e.preventDefault();
        router.push("/");
      }}
    >
      <HomeIcon className="w-5 h-5 text-white stroke-2" />
    </button>
  );
}
