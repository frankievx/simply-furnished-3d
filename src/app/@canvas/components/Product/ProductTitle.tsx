"use client";
import { showAtom } from "@/state/show";
import { useState } from "react";
import { useTransition } from "@react-spring/web";
import { animated as animated3, SpringValue } from "@react-spring/three";
import { Billboard, Line, Text, useMask } from "@react-three/drei";
import { useAtomValue } from "jotai";

const PAPER = "#fbf7ea";
const PAPER_RING = "#efe7cf";
const INK = "#2b271c";
const EDGE = "#b9ad8a";
const SANS = "/fonts/noto-sans.ttf";

const AnimatedLine = animated3(Line);

type Stencil = ReturnType<typeof useMask>;
type Opacity = SpringValue<number>;

// A flat rounded rectangle with a stencil, so it is only drawn inside the
// frame and slides in with the chair like the title does.
function Shape({
  size,
  radius,
  color,
  opacity,
  stencil,
  position,
  order,
}: {
  size: [number, number];
  radius: number;
  color: string;
  opacity: Opacity;
  stencil: Stencil;
  position: [number, number, number];
  order: number;
}) {
  return (
    <mesh position={position} renderOrder={order}>
      {/* @ts-ignore */}
      <roundedPlaneGeometry args={[size[0], size[1], radius]} />
      <animated3.meshBasicMaterial
        {...stencil}
        color={color}
        opacity={opacity}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
}

const CHIP = 0.04;
const LABEL_H = 0.105;
const LABEL_PAD = 0.12;

// The eyebrow: a paper label holding the material, with a paint chip at each
// end showing the seat colour (left) and the leg colour (right).
function PaperLabel({
  text,
  seat,
  legs,
  opacity,
  stencil,
}: {
  text: string;
  seat: string;
  legs: string;
  opacity: Opacity;
  stencil: Stencil;
}) {
  const [textWidth, setTextWidth] = useState(0.5);
  const width = textWidth + LABEL_PAD * 2;
  const chipX = width / 2 - 0.058;
  const edge = [
    [-width / 2 + 0.012, LABEL_H / 2 - 0.012, 0],
    [width / 2 - 0.012, LABEL_H / 2 - 0.012, 0],
    [width / 2 - 0.012, -LABEL_H / 2 + 0.012, 0],
    [-width / 2 + 0.012, -LABEL_H / 2 + 0.012, 0],
    [-width / 2 + 0.012, LABEL_H / 2 - 0.012, 0],
  ] as [number, number, number][];
  return (
    <group position={[0, 0.1, 0.2]}>
      <Shape
        size={[width, LABEL_H]}
        radius={0.012}
        color={PAPER}
        opacity={opacity}
        stencil={stencil}
        position={[0, 0, 0]}
        order={1}
      />
      <AnimatedLine
        points={edge}
        color={EDGE}
        lineWidth={1}
        dashed
        dashSize={0.012}
        gapSize={0.009}
        opacity={opacity}
        transparent
        toneMapped={false}
        position={[0, 0, 0.001]}
        renderOrder={2}
        {...stencil}
      />
      {[
        { x: -chipX, color: seat },
        { x: chipX, color: legs },
      ].map(({ x, color }) => (
        <group key={x} position={[x, 0, 0.002]}>
          <Shape size={[CHIP + 0.011, CHIP + 0.011]} radius={0.006} color="#8f8a78" opacity={opacity} stencil={stencil} position={[0, 0, 0]} order={3} />
          <Shape size={[CHIP + 0.007, CHIP + 0.007]} radius={0.005} color={PAPER} opacity={opacity} stencil={stencil} position={[0, 0, 0.0005]} order={4} />
          <Shape size={[CHIP, CHIP]} radius={0.004} color={color} opacity={opacity} stencil={stencil} position={[0, 0, 0.001]} order={5} />
        </group>
      ))}
      <Text
        position={[0, 0, 0.004]}
        color={INK}
        anchorX="center"
        anchorY="middle"
        fontSize={0.04}
        letterSpacing={0.15}
        font={SANS}
        renderOrder={6}
        onSync={(troika: any) => {
          const bounds = troika.textRenderInfo?.blockBounds;
          if (bounds) setTextWidth(bounds[2] - bounds[0]);
        }}
      >
        {text.toUpperCase()}
        <animated3.meshBasicMaterial {...stencil} opacity={opacity} transparent />
      </Text>
    </group>
  );
}

const TAG_H = 0.094;

// The price, on a tag hung beside the chair.
function PriceTag({
  price,
  opacity,
  stencil,
}: {
  price: string;
  opacity: Opacity;
  stencil: Stencil;
}) {
  const [textWidth, setTextWidth] = useState(0.2);
  const width = textWidth + 0.1;
  return (
    <group position={[0.27, -0.58, 0.2]} rotation={[0, 0, -0.14]}>
      <Shape
        size={[width, TAG_H]}
        radius={TAG_H / 2}
        color="#ffffff"
        opacity={opacity}
        stencil={stencil}
        position={[0, 0, 0]}
        order={1}
      />
      <mesh position={[-width / 2 + 0.032, 0, 0.001]} renderOrder={2}>
        <circleGeometry args={[0.0085, 16]} />
        <animated3.meshBasicMaterial {...stencil} color="#8c8470" opacity={opacity} transparent toneMapped={false} />
      </mesh>
      <AnimatedLine
        points={[
          [-width / 2, 0, 0],
          [-width / 2 - 0.05, -0.014, 0],
        ]}
        color="#5f584b"
        lineWidth={1}
        opacity={opacity}
        transparent
        toneMapped={false}
        renderOrder={2}
        {...stencil}
      />
      <Text
        position={[-width / 2 + 0.065, 0, 0.003]}
        color="#111111"
        anchorX="left"
        anchorY="middle"
        fontSize={0.053}
        font={SANS}
        strokeWidth={0.0012}
        strokeColor="#111111"
        renderOrder={3}
        onSync={(troika: any) => {
          const bounds = troika.textRenderInfo?.blockBounds;
          if (bounds) setTextWidth(bounds[2] - bounds[0]);
        }}
      >
        {price}
        <animated3.meshBasicMaterial {...stencil} opacity={opacity} transparent />
      </Text>
    </group>
  );
}

export function ProductTitle({
  title,
  subtitle,
  price,
  seat,
  legs,
}: {
  title: string;
  subtitle: string;
  price: string;
  seat: string;
  legs: string;
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
          {/* Inside the frame only, so the label and tag slide in with their
              chair and are revealed by the frame like the title. */}
          <PaperLabel
            text={subtitle}
            seat={seat}
            legs={legs}
            opacity={style.opacity}
            stencil={stencil2}
          />
          <PriceTag price={price} opacity={style.opacity} stencil={stencil2} />
        </Billboard>
      )
  );
}
