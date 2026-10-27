import { useMemo } from "react";
import { Box, Glow, Lit, Platform, Room, Words, SANS_FONT } from "./parts";
import { plaster, tatami } from "./textures";

export const JAPANDI_LIFT = 0.06;

const OAK = "#b98d5e";
const INDIGO = "#273a5c";

function Slats({ from, to }: { from: number; to: number }) {
  const xs = [];
  for (let x = from; x <= to; x += 0.09) xs.push(x);
  return (
    <>
      {xs.map((x) => (
        <Box key={x} args={[0.045, 3.2, 0.05]} position={[x, 1.6, 0.04]} color={OAK} roughness={0.8} />
      ))}
    </>
  );
}

function Noren() {
  const panels = [-0.75, -0.25, 0.25, 0.75];
  return (
    <group position={[0, 2.72, 0.06]}>
      <Box args={[1.9, 0.03, 0.03]} position={[0, 0.26, 0]} color="#3b2b20" />
      {panels.map((x) => (
        <Box key={x} args={[0.47, 0.5, 0.008]} position={[x, 0, 0]} color={INDIGO} roughness={1} />
      ))}
      <mesh position={[0, 0.02, 0.006]}>
        <circleGeometry args={[0.14, 40]} />
        <meshStandardMaterial color="#f1ead9" roughness={1} />
      </mesh>
      <Words position={[0, 0.02, 0.008]} size={0.1} color={INDIGO}>
        SF
      </Words>
      <Words position={[-0.75, -0.1, 0.006]} size={0.034} color="#f1ead9" font={SANS_FONT} spacing={0.35}>
        SIMPLY
      </Words>
      <Words position={[0.75, -0.1, 0.006]} size={0.034} color="#f1ead9" font={SANS_FONT} spacing={0.35}>
        FURNISHED
      </Words>
    </group>
  );
}

function Andon({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0.45]}>
      <Box args={[0.2, 0.02, 0.2]} position={[0, 0.01, 0]} color="#3b2b20" />
      <mesh position={[0, 0.27, 0]}>
        <boxGeometry args={[0.17, 0.48, 0.17]} />
        <Lit color="#fff3dc" />
      </mesh>
      {[-0.085, 0.085].map((dx) => (
        <Box key={dx} args={[0.012, 0.5, 0.012]} position={[dx, 0.27, 0.086]} color="#3b2b20" shadows={false} />
      ))}
      <Glow position={[0, 0.3, -0.1]} size={1.0} color="#ffcf8f" opacity={0.5} />
      <Glow position={[0, 0.004, 0.1]} size={0.9} color="#ffcf8f" opacity={0.35} flat />
    </group>
  );
}

export function Japandi() {
  const { wall, floor } = useMemo(
    () => ({
      wall: plaster("#e4d3bb", "rgba(242,230,212,0.5)", "rgba(196,170,138,0.3)"),
      floor: tatami([3, 2]),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.9 }} />
      <Box args={[12, 0.08, 0.02]} position={[0, 0.04, 0.01]} color="#3b2b20" />
      <Slats from={-4.4} to={-2.95} />
      <Slats from={2.95} to={4.4} />
      <Noren />
      <Platform height={JAPANDI_LIFT} front={1.4} back={0.84} color="#6b4c34" />
      <Andon x={-2.25} />
      <Andon x={2.25} />
    </>
  );
}
