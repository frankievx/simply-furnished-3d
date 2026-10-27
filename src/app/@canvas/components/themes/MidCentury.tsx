import { useMemo } from "react";
import { Box, Lit, Pendant, Room, Words, SANS_FONT } from "./parts";
import { boards, plaster, terrazzo } from "./textures";

const WALNUT = "#5e3b25";
const TEAL = "#2f6f6a";
const ORANGE = "#d0683a";
const MUSTARD = "#d9a441";
const BRASS = "#c39a4e";

function Sunburst({ x, y }: { x: number; y: number }) {
  const rays = 24;
  return (
    <group position={[x, y, 0.03]}>
      {Array.from({ length: rays }, (_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const len = i % 2 ? 0.22 : 0.3;
        return (
          <Box
            key={i}
            args={[0.012, len, 0.01]}
            position={[Math.sin(a) * (0.08 + len / 2), Math.cos(a) * (0.08 + len / 2), 0]}
            rotation={[0, 0, -a]}
            color={BRASS}
            metalness={0.8}
            roughness={0.3}
          />
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.03, 32]} />
        <meshStandardMaterial color={TEAL} />
      </mesh>
    </group>
  );
}

function Globe({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <Pendant
      position={[x, y, z]}
      glowColor="#ffe2b0"
      cordColor={BRASS}
      shade={
        <>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.05, 12]} />
            <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.12, 32, 16]} />
            <Lit color="#fff4dc" />
          </mesh>
        </>
      }
    />
  );
}

export function MidCentury() {
  const { wall, floor, panel } = useMemo(
    () => ({
      wall: plaster("#efe2c9", "rgba(250,242,226,0.5)", "rgba(214,192,154,0.25)"),
      floor: terrazzo([4, 1.4]),
      panel: boards(["#6b4329", "#5e3b25", "#714a2e", "#57361f"], "rgba(30,18,10,0.7)", [6, 1]),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.4 }} />
      {/* Walnut wainscot, kept below the neighbouring titles. */}
      <Box args={[12, 0.95, 0.03]} position={[0, 0.475, 0.015]} map={panel} />
      <Box args={[12, 0.03, 0.05]} position={[0, 0.96, 0.025]} color={BRASS} metalness={0.7} roughness={0.35} />
      {/* The sign: a teal pill with a cream wordmark. */}
      <group position={[0, 2.68, 0.03]}>
        <mesh>
          {/* @ts-ignore */}
          <roundedPlaneGeometry args={[2.3, 0.42, 0.21]} />
          <meshBasicMaterial color={TEAL} />
        </mesh>
        <Words position={[0, 0.03, 0.01]} size={0.19} color="#f6ecd8">
          Simply Furnished
        </Words>
        <Words position={[0, -0.13, 0.01]} size={0.035} color={MUSTARD} font={SANS_FONT} spacing={0.5}>
          MODERN FURNITURE
        </Words>
      </group>
      <Sunburst x={-2.3} y={2.4} />
      <Globe x={2.15} y={2.4} z={0.3} />
      <Globe x={2.45} y={2.25} z={0.35} />
      <Globe x={2.75} y={2.45} z={0.3} />
      {/* An orange rug under the middle of the row. */}
      <Box args={[2.0, 0.006, 0.75]} position={[0, 0.003, 1.05]} color={ORANGE} roughness={1} shadows={false} />
      <Box args={[1.86, 0.007, 0.63]} position={[0, 0.004, 1.05]} color="#c98a5e" roughness={1} shadows={false} />
      {/* A credenza with a lamp at the far left. */}
      <group position={[-3.55, 0, 0.3]}>
        <Box args={[1.2, 0.42, 0.4]} position={[0, 0.33, 0]} color={WALNUT} roughness={0.5} />
        {[-0.5, 0.5].map((dx) => (
          <Box key={dx} args={[0.03, 0.12, 0.03]} position={[dx, 0.06, 0.1]} color="#2a1c12" />
        ))}
        <mesh position={[0.3, 0.68, 0]}>
          <coneGeometry args={[0.13, 0.18, 24, 1, true]} />
          <meshStandardMaterial color={MUSTARD} side={2} />
        </mesh>
        <Box args={[0.015, 0.14, 0.015]} position={[0.3, 0.6, 0]} color={BRASS} metalness={0.8} />
      </group>
    </>
  );
}
