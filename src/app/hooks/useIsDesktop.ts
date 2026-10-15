import { useEffect, useState } from "react";

// A wide screen with a mouse. The site is desktop only.
const DESKTOP_QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** null until the browser has been asked, so nothing heavy starts on a guess. */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isDesktop;
}
