import { useMemo } from "react";
import { Box, Glow, GridWindow, Room, Words } from "./parts";
import { brick, concrete, street } from "./textures";

const STEEL = "#1d1d1d";
const NEON = "#ff8a6b";

function TrackSpot({ x }: { x: number }) {
  return (
    <group position={[x, 2.88, 0.75]}>
      <Box args={[0.02, 0.08, 0.02]} position={[0, -0.04, 0]} color={STEEL} shadows={false} />
      <mesh position={[0, -0.12, 0.03]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.16, 16]} />
        <meshStandardMaterial color={STEEL} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function Loft() {
  const { wall, floor, view } = useMemo(
    () => ({
      wall: brick([3, 1]),
      floor: concrete([3, 1]),
      view: street(["#b9cfdf", "#eef2f2"], ["#9e6b55", "#a77d68", "#8d5f4c", "#b48a74"]),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.3, metalness: 0.05 }} />
      <GridWindow x={-3.65} y={1.6} width={1.3} height={2.3} cols={3} rows={5} view={view} />
      <GridWindow x={3.65} y={1.6} width={1.3} height={2.3} cols={3} rows={5} view={view} />
      {/* Ceiling track with spots over each stop, and their pools of light. */}
      <Box args={[12, 0.03, 0.04]} position={[0, 2.9, 0.75]} color={STEEL} shadows={false} />
      {[-1.5, 0, 1.5].map((x) => (
        <group key={x}>
          <TrackSpot x={x} />
          <Glow position={[x, 0.005, 1.15]} size={[1.3, 0.9]} color="#ffe6c2" opacity={0.45} flat />
        </group>
      ))}
      {/* Neon script above the frame. */}
      <Glow position={[0, 2.62, 0.01]} size={[2.6, 0.7]} color="#ff7b5c" opacity={0.45} />
      <Words position={[0, 2.62, 0.03]} size={0.24} color={NEON} emissive>
        simply furnished
      </Words>
      {/* Exposed pipe down each side. */}
      {[-2.95, 2.95].map((x) => (
        <mesh key={x} position={[x, 1.6, 0.06]}>
          <cylinderGeometry args={[0.03, 0.03, 3.2, 12]} />
          <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
    </>
  );
}
