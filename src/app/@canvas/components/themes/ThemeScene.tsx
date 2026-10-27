import { ComponentType } from "react";
import { ThemeKey } from "./themeState";
import { Stage } from "./parts";
import { Parisian } from "./Parisian";
import { Scandi, SCANDI_LIFT } from "./Scandi";
import { Japandi, JAPANDI_LIFT } from "./Japandi";
import { MidCentury } from "./MidCentury";
import { Loft } from "./Loft";
import { Mediterranean } from "./Mediterranean";

const scenes: Partial<Record<ThemeKey, ComponentType>> = {
  parisian: Parisian,
  scandi: Scandi,
  japandi: Japandi,
  midcentury: MidCentury,
  loft: Loft,
  mediterranean: Mediterranean,
};

/** How far a theme's platform raises the chairs, in metres. */
export const themeLift: Partial<Record<ThemeKey, number>> = {
  scandi: SCANDI_LIFT,
  japandi: JAPANDI_LIFT,
};

export function ThemeScene({ theme }: { theme: ThemeKey }) {
  const Scene = scenes[theme];
  if (!Scene) return null;
  return (
    <Stage>
      <Scene />
    </Stage>
  );
}
