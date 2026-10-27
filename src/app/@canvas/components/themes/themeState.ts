import { atom } from "jotai";

// The storefront themes: the original real-time room, and rooms rendered in
// Blender for the fixed camera (art/storefront). Switch with `?theme=<key>`
// or the picker.
export const themes = [
  { key: "original", label: "Original" },
  { key: "scandi", label: "Scandi daylight" },
  { key: "japandi", label: "Japandi atelier" },
] as const;

export type ThemeKey = (typeof themes)[number]["key"];

const STORAGE_KEY = "sf-theme";

const isThemeKey = (value: string | null): value is ThemeKey =>
  themes.some((theme) => theme.key === value);

// The carousel drops the query string when it navigates, so the choice is
// also kept for the session.
export const readTheme = (): ThemeKey => {
  if (typeof window === "undefined") return "original";
  const fromUrl = new URLSearchParams(window.location.search).get("theme");
  if (isThemeKey(fromUrl)) {
    try {
      sessionStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {}
    return fromUrl;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isThemeKey(stored)) return stored;
  } catch {}
  return "original";
};

export const saveTheme = (key: ThemeKey) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, key);
  } catch {}
  const url = new URL(window.location.href);
  url.searchParams.set("theme", key);
  window.history.replaceState(window.history.state, "", url);
};

export const themeAtom = atom<ThemeKey>(readTheme());
