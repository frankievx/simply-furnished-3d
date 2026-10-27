import { useMemo } from "react";
import { ArchWindow, Box, Room, Words, SANS_FONT } from "./parts";
import { azulejo, cotto, plaster, seaView } from "./textures";

const LIME = "#efe3cc";
const NAVY = "#23417a";

function LemonTree({ x }: { x: number }) {
  const fruit = [
    [0.12, 0.72, 0.15],
    [-0.14, 0.62, 0.12],
    [0.05, 0.55, 0.18],
    [-0.08, 0.8, 0.1],
    [0.16, 0.6, 0.02],
  ];
  return (
    <group position={[x, 0, 0.4]}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.11, 0.28, 24]} />
        <meshStandardMaterial color="#b9643c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.28, 6]} />
        <meshStandardMaterial color="#6b5238" />
      </mesh>
      <mesh position={[0, 0.66, 0]} castShadow>
        <icosahedronGeometry args={[0.23, 2]} />
        <meshStandardMaterial color="#4d6b33" roughness={0.9} flatShading />
      </mesh>
      {fruit.map(([fx, fy, fz], i) => (
        <mesh key={i} position={[fx, fy, fz]}>
          <sphereGeometry args={[0.03, 12, 8]} />
          <meshStandardMaterial color="#f2c933" />
        </mesh>
      ))}
    </group>
  );
}

export function Mediterranean() {
  const { wall, floor, view, tiles } = useMemo(
    () => ({
      wall: plaster(LIME, "rgba(250,244,232,0.55)", "rgba(214,192,156,0.3)"),
      floor: cotto([10, 3.4]),
      view: seaView(),
      tiles: azulejo([8, 1]),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.75 }} />
      {/* Arches open onto the sea at either end. */}
      <ArchWindow x={-3.45} width={0.9} height={2.2} sill={0.0} frame="#e8d9bd" view={view} bars={0} depth={0.12} />
      <ArchWindow x={3.45} width={0.9} height={2.2} sill={0.0} frame="#e8d9bd" view={view} bars={0} depth={0.12} />
      {/* A tiled skirting and a hand-painted plaque for the name. */}
      <Box args={[12, 0.22, 0.012]} position={[0, 0.11, 0.006]} map={tiles} shadows={false} />
      <group position={[0, 2.7, 0.02]}>
        <Box args={[2.2, 0.5, 0.025]} position={[0, 0, 0]} color="#f7f2e8" />
        <Box args={[2.28, 0.58, 0.02]} position={[0, 0, -0.005]} color={NAVY} />
        <Words position={[0, 0.04, 0.02]} size={0.19} color={NAVY}>
          Simply Furnished
        </Words>
        <Words position={[0, -0.14, 0.02]} size={0.035} color={NAVY} font={SANS_FONT} spacing={0.5}>
          MOBILI · CASA · GIARDINO
        </Words>
      </group>
      <LemonTree x={-2.3} />
      <LemonTree x={2.3} />
    </>
  );
}
