import { useMemo } from "react";
import { Box, Glow, Lit, Pendant, Picture, Platform, Room, Words, SANS_FONT } from "./parts";
import { boards, canvasTexture, plaster } from "./textures";

export const SCANDI_LIFT = 0.07;

const sky = () =>
  canvasTexture(1024, 128, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#9ec7e6");
    g.addColorStop(1, "#e3f0f6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    [120, 430, 760].forEach((x) => {
      ctx.beginPath();
      ctx.ellipse(x, 70, 90, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  });

function PaperLamp({ x, y, z }: { x: number; y: number; z: number }) {
  return (
    <Pendant
      position={[x, y, z]}
      glowColor="#fff0d6"
      shade={
        <mesh>
          <sphereGeometry args={[0.2, 32, 16]} />
          <Lit color="#fbf6ec" />
        </mesh>
      }
    />
  );
}

function Branches({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0.45]}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.44, 24]} />
        <meshStandardMaterial color="#e9e4da" roughness={0.6} />
      </mesh>
      {[-0.35, 0.05, 0.4].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.3, 0.44 + Math.cos(a) * 0.3, 0]} rotation={[0, 0, -a]} castShadow>
          <cylinderGeometry args={[0.006, 0.01, 0.62, 5]} />
          <meshStandardMaterial color="#5b4a3a" />
        </mesh>
      ))}
    </group>
  );
}

export function Scandi() {
  const { wall, floor, view } = useMemo(
    () => ({
      wall: plaster("#f5f2ec", "rgba(255,255,255,0.5)", "rgba(225,220,210,0.25)"),
      floor: boards(["#e3d3b8", "#dccaab", "#e8dbc4", "#d6c3a2"], "rgba(150,125,95,0.5)", [3, 1]),
      view: sky(),
    }),
    []
  );
  return (
    <>
      <Room wall={{ map: wall }} floor={{ map: floor, roughness: 0.55 }} />
      {/* A clerestory window band along the top. */}
      <Picture size={[12, 0.5]} position={[0, 2.78, 0.004]} map={view} />
      <Box args={[12, 0.05, 0.06]} position={[0, 2.52, 0.03]} color="#ffffff" />
      {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((x) => (
        <Box key={x} args={[0.05, 0.5, 0.05]} position={[x, 2.78, 0.025]} color="#ffffff" shadows={false} />
      ))}
      {/* Daylight falling across the floor. */}
      {[-2.4, -0.6, 1.2, 3.0].map((x) => (
        <Glow key={x} position={[x, 0.005, 1.0]} size={[1.0, 2.2]} color="#fff6e0" opacity={0.28} flat />
      ))}
      <Words position={[0, 2.34, 0.01]} size={0.12} color="#2f2c28" font={SANS_FONT} spacing={0.12}>
        simply furnished
      </Words>
      <Words position={[0, 2.23, 0.01]} size={0.035} color="#6f6a62" font={SANS_FONT} spacing={0.4}>
        SHOWROOM · NORDIC CHAIRS
      </Words>
      <Platform height={SCANDI_LIFT} front={1.42} back={0.82} color="#eadbc2" edge="#c9b393" />
      <PaperLamp x={-2.55} y={2.45} z={0.5} />
      <PaperLamp x={2.6} y={2.35} z={0.5} />
      <Branches x={2.3} />
    </>
  );
}
