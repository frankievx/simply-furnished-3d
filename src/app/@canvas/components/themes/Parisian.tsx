import { useMemo } from "react";
import { ArchWindow, Box, Glow, Room, Words, SANS_FONT, Lit } from "./parts";
import { checker, plaster, street } from "./textures";

const GREEN = "#1e3a2f";
const GOLD = "#cdae62";
const CREAM = "#f6efe2";

function Moulding({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const t = 0.022;
  return (
    <group position={[x, y, 0.01]}>
      <Box args={[w, t, t]} position={[0, h / 2, 0]} color={CREAM} shadows={false} />
      <Box args={[w, t, t]} position={[0, -h / 2, 0]} color={CREAM} shadows={false} />
      <Box args={[t, h, t]} position={[-w / 2, 0, 0]} color={CREAM} shadows={false} />
      <Box args={[t, h, t]} position={[w / 2, 0, 0]} color={CREAM} shadows={false} />
    </group>
  );
}

function Topiary({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0.4]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.1, 0.3, 24]} />
        <meshStandardMaterial color={GREEN} roughness={0.4} />
      </mesh>
      <Box args={[0.28, 0.02, 0.28]} position={[0, 0.3, 0]} color={GOLD} metalness={0.7} roughness={0.3} />
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
        <meshStandardMaterial color="#5a4632" />
      </mesh>
      <mesh position={[0, 0.66, 0]} castShadow>
        <icosahedronGeometry args={[0.2, 3]} />
        <meshStandardMaterial color="#3f5e35" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

function Sconce({ x }: { x: number }) {
  return (
    <group position={[x, 1.9, 0]}>
      <Box args={[0.06, 0.12, 0.02]} position={[0, 0, 0.01]} color={GOLD} metalness={0.8} roughness={0.3} />
      <Box args={[0.015, 0.015, 0.1]} position={[0, -0.02, 0.06]} color={GOLD} metalness={0.8} roughness={0.3} />
      <mesh position={[0, 0.05, 0.11]}>
        <cylinderGeometry args={[0.035, 0.05, 0.08, 16]} />
        <Lit color="#fff1d0" />
      </mesh>
      <Glow position={[0, 0.08, 0.02]} size={0.7} color="#ffd9a0" opacity={0.6} />
    </group>
  );
}

export function Parisian() {
  const { wall, floor, view } = useMemo(
    () => ({
      wall: plaster("#f4e8d3", "rgba(255,250,240,0.45)", "rgba(226,206,172,0.25)"),
      floor: checker("#222120", "#efebe3", [9, 3]),
      view: street(["#a7c3d8", "#eef1ee"], ["#d9ccb5", "#cdbb9c", "#e6dbc8", "#c4b496"]),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.35 }} />
      {/* Panelled walls: a dado rail, lower and upper mouldings. */}
      <Box args={[12, 0.12, 0.03]} position={[0, 0.06, 0.015]} color={CREAM} />
      <Box args={[12, 0.035, 0.035]} position={[0, 0.95, 0.017]} color={CREAM} />
      {[-3.3, -2.2, -1.1, 0, 1.1, 2.2, 3.3].map((x) => (
        <Moulding key={`l${x}`} x={x} y={0.55} w={0.85} h={0.6} />
      ))}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((x) => (
        <Moulding key={`u${x}`} x={x} y={1.7} w={0.85} h={1.2} />
      ))}
      {/* The shop sign across the top. */}
      <Box args={[12, 0.74, 0.08]} position={[0, 2.85, 0.04]} color={GREEN} roughness={0.35} />
      <Box args={[12, 0.014, 0.012]} position={[0, 2.53, 0.085]} color={GOLD} metalness={0.8} roughness={0.3} shadows={false} />
      <Words position={[0, 2.79, 0.09]} size={0.19} color={GOLD} spacing={0.08}>
        SIMPLY FURNISHED
      </Words>
      <Words position={[0, 2.62, 0.09]} size={0.042} color={GOLD} font={SANS_FONT} spacing={0.5}>
        MAISON DE MOBILIER
      </Words>
      {/* Shop windows onto the street at either end. */}
      <ArchWindow x={-3.45} width={0.8} height={2.0} sill={0.35} frame={GREEN} view={view} />
      <ArchWindow x={3.45} width={0.8} height={2.0} sill={0.35} frame={GREEN} view={view} />
      <Sconce x={-1.3} />
      <Sconce x={1.3} />
      <Topiary x={-2.3} />
      <Topiary x={2.3} />
    </>
  );
}
