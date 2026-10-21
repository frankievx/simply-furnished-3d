"use client";
import { showAtom } from "@/state/show";
import { useTransition } from "@react-spring/web";
import { animated as animated3 } from "@react-spring/three";
import { Billboard, Text, useMask } from "@react-three/drei";
import { useAtomValue } from "jotai";
// Lighter than the title so the name stays the headline.
const DETAIL_COLOR = "#5f584b";

export function ProductTitle({
  title,
  subtitle,
  price,
}: {
  title: string;
  subtitle: string;
  price: string;
}) {
  const stencil = useMask(1, true);
  const stencil2 = useMask(1, false);
  const show = useAtomValue(showAtom);
  const transition = useTransition(show.itemTitles, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration: 800 },
  });
  return transition(
    (style, show) =>
      show && (
        <Billboard position={[0, 0, 1.3]}>
          <Text
            color="black"
            anchorX="center"
            anchorY="top"
            fontSize={0.15}
            font={"/fonts/casanova.ttf"}
          >
            {title}
            <animated3.meshBasicMaterial {...stencil} opacity={style.opacity} />
          </Text>
          <Text
            position={[0, 0, 0.2]}
            color="black"
            anchorX="center"
            anchorY="top"
            fontSize={0.18}
            font={"/fonts/casanova.ttf"}
          >
            {title}
            <animated3.meshBasicMaterial
              {...stencil2}
              opacity={style.opacity}
            />
          </Text>
          {/* Inside the frame only, so each chair's details slide in with it
              and are revealed by the frame like the title. */}
          <Text
            position={[0, -0.24, 0.2]}
            color={DETAIL_COLOR}
            anchorX="center"
            anchorY="top"
            fontSize={0.056}
            letterSpacing={0.03}
            maxWidth={0.72}
            textAlign="center"
            font={"/fonts/casanova.ttf"}
          >
            {subtitle}
            <animated3.meshBasicMaterial
              {...stencil2}
              opacity={style.opacity}
            />
          </Text>
          <Text
            position={[0, -0.34, 0.2]}
            color={DETAIL_COLOR}
            anchorX="center"
            anchorY="top"
            fontSize={0.085}
            font={"/fonts/casanova.ttf"}
          >
            {price}
            <animated3.meshBasicMaterial
              {...stencil2}
              opacity={style.opacity}
            />
          </Text>
        </Billboard>
      )
  );
}
