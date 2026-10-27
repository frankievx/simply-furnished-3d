import { ReactNode, useMemo } from "react";
import { AdditiveBlending, Texture } from "three";
import { Text } from "@react-three/drei";
import { glow } from "./textures";

// Theme parts are authored in a stage frame: x across, y up from the floor,
// z out from the back wall towards the camera. The chairs stand at z 1.12 and
// the camera sits at y 1.2, z 3.26. On the wall, the frame's top edge is at
// y 2.1, the neighbouring titles sit around y 1.35-1.75 at x ±2-2.75, and
// above y 2.45 is clear for a sign.
export const FLOOR_Z = -10.2;

export function Stage({ children }: { children: ReactNode }) {
  return (
    <group position={[0, 0, FLOOR_Z]} rotation={[Math.PI / 2, 0, 0]}>
      {children}
    </group>
  );
}

type Surface = { color?: string; map?: Texture; roughness?: number; metalness?: number };

export function Room({ wall, floor }: { wall: Surface; floor: Surface }) {
  return (
    <>
      <mesh position={[0, 2, 0]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial roughness={0.95} {...wall} />
      </mesh>
      <mesh position={[0, 0, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial roughness={0.8} {...floor} />
      </mesh>
    </>
  );
}

export function Box({
  args,
  position,
  rotation,
  color,
  roughness = 0.7,
  metalness = 0,
  map,
  shadows = true,
}: {
  args: [number, number, number];
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  roughness?: number;
  metalness?: number;
  map?: Texture;
  shadows?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadows} receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} map={map} />
    </mesh>
  );
}

/** A flat lit picture (a view outside, a lamp face): ignores scene light. */
export function Picture({
  size,
  position,
  map,
  color,
  rotation,
}: {
  size: [number, number];
  position: [number, number, number];
  map?: Texture;
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={map} color={color} toneMapped={false} />
    </mesh>
  );
}

export function Glow({
  position,
  size,
  color,
  opacity = 1,
  flat = false,
}: {
  position: [number, number, number];
  size: number | [number, number];
  color: string;
  opacity?: number;
  flat?: boolean;
}) {
  const map = useMemo(() => glow(color), [color]);
  const [w, h] = typeof size === "number" ? [size, size] : size;
  return (
    <mesh position={position} rotation={flat ? [-Math.PI / 2, 0, 0] : [0, 0, 0]} renderOrder={-1}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** A tall window with a round arch, a view behind glass and glazing bars. */
export function ArchWindow({
  x,
  width,
  height,
  sill = 0.3,
  frame,
  view,
  bars = 2,
  depth = 0.06,
}: {
  x: number;
  width: number;
  height: number;
  sill?: number;
  frame: string;
  view: Texture;
  bars?: number;
  depth?: number;
}) {
  const r = width / 2;
  const rect = height - r;
  const t = 0.05;
  return (
    <group position={[x, sill, 0]}>
      <Picture size={[width, rect]} position={[0, rect / 2, 0.004]} map={view} />
      <mesh position={[0, rect, 0.004]}>
        <circleGeometry args={[r, 40, 0, Math.PI]} />
        <meshBasicMaterial map={view} toneMapped={false} />
      </mesh>
      <Box args={[t, rect, depth]} position={[-r, rect / 2, depth / 2]} color={frame} />
      <Box args={[t, rect, depth]} position={[r, rect / 2, depth / 2]} color={frame} />
      <mesh position={[0, rect, depth / 2]} castShadow>
        <torusGeometry args={[r, t / 2, 8, 40, Math.PI]} />
        <meshStandardMaterial color={frame} roughness={0.5} />
      </mesh>
      <Box args={[width + 0.14, 0.05, depth + 0.08]} position={[0, 0, depth / 2 + 0.03]} color={frame} />
      {Array.from({ length: bars }, (_, i) => {
        const bx = -r + ((i + 1) * width) / (bars + 1);
        return <Box key={i} args={[0.018, rect, 0.02]} position={[bx, rect / 2, 0.02]} color={frame} shadows={false} />;
      })}
      <Box args={[width, 0.018, 0.02]} position={[0, rect * 0.62, 0.02]} color={frame} shadows={false} />
    </group>
  );
}

/** A steel factory window: one view and a grid of thin bars. */
export function GridWindow({
  x,
  y,
  width,
  height,
  cols,
  rows,
  view,
  frame = "#1d1d1d",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  cols: number;
  rows: number;
  view: Texture;
  frame?: string;
}) {
  return (
    <group position={[x, y, 0]}>
      <Picture size={[width, height]} position={[0, 0, 0.004]} map={view} />
      {Array.from({ length: cols + 1 }, (_, i) => (
        <Box
          key={`c${i}`}
          args={[i % cols === 0 ? 0.05 : 0.018, height, 0.03]}
          position={[-width / 2 + (i * width) / cols, 0, 0.015]}
          color={frame}
          roughness={0.4}
          metalness={0.6}
        />
      ))}
      {Array.from({ length: rows + 1 }, (_, i) => (
        <Box
          key={`r${i}`}
          args={[width, i % rows === 0 ? 0.05 : 0.018, 0.03]}
          position={[0, -height / 2 + (i * height) / rows, 0.015]}
          color={frame}
          roughness={0.4}
          metalness={0.6}
        />
      ))}
    </group>
  );
}

/** A lamp hanging from above the top of the screen. */
export function Pendant({
  position,
  shade,
  glowColor,
  cordColor = "#2a2622",
  children,
}: {
  position: [number, number, number];
  shade: ReactNode;
  glowColor: string;
  cordColor?: string;
  children?: ReactNode;
}) {
  const [x, y, z] = position;
  const cord = 4 - y;
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, cord / 2, 0]}>
        <cylinderGeometry args={[0.004, 0.004, cord, 6]} />
        <meshBasicMaterial color={cordColor} />
      </mesh>
      {shade}
      <Glow position={[0, -0.05, -0.02]} size={0.9} color={glowColor} opacity={0.55} />
      {children}
    </group>
  );
}

/** An emissive surface, for lamp shades and neon. */
export function Lit({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <meshBasicMaterial color={color} toneMapped={false} transparent={opacity < 1} opacity={opacity} />;
}

export const DISPLAY_FONT = "/fonts/casanova.ttf";
export const SANS_FONT = "/fonts/noto-sans.ttf";

export function Words({
  children,
  position,
  size,
  color,
  font = DISPLAY_FONT,
  spacing = 0,
  emissive = false,
  anchorX = "center",
}: {
  children: string;
  position: [number, number, number];
  size: number;
  color: string;
  font?: string;
  spacing?: number;
  emissive?: boolean;
  anchorX?: "center" | "left" | "right";
}) {
  return (
    <Text
      position={position}
      fontSize={size}
      font={font}
      letterSpacing={spacing}
      anchorX={anchorX}
      anchorY="middle"
      color={color}
    >
      {children}
      {emissive ? <meshBasicMaterial color={color} toneMapped={false} /> : <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />}
    </Text>
  );
}

/** A low run of display platform under the whole row. */
export function Platform({
  height,
  front,
  back = 0.45,
  color,
  edge,
  map,
}: {
  height: number;
  front: number;
  back?: number;
  color: string;
  edge?: string;
  map?: Texture;
}) {
  const depth = front - back;
  return (
    <group>
      <Box args={[12, height, depth]} position={[0, height / 2, back + depth / 2]} color={color} map={map} roughness={0.6} />
      {edge && (
        <Box args={[12, 0.012, 0.012]} position={[0, height, front]} color={edge} metalness={0.8} roughness={0.3} shadows={false} />
      )}
    </group>
  );
}
