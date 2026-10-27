"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { saveTheme, themeAtom, themes } from "@/app/@canvas/components/themes/themeState";

// Switch between the storefront themes (REN-64).
// Hidden with `?clean`, so screenshots show the scene alone.
export function TheThemePicker() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    setHidden(new URLSearchParams(window.location.search).has("clean"));
  }, []);
  if (hidden) return null;
  return (
    <div className="absolute top-3 left-3 flex flex-wrap gap-1 pointer-events-auto max-w-[60vw]">
      {themes.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            saveTheme(key);
            setTheme(key);
          }}
          className={`rounded-full px-3 py-1 text-xs backdrop-blur-md shadow ${
            key === theme ? "bg-[#2b271c] text-white" : "bg-white/70 text-[#2b271c]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
