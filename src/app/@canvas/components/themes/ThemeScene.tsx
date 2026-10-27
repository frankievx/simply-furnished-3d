import { useEffect, useMemo, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  EquirectangularReflectionMapping,
  SRGBColorSpace,
  Object3D,
  ShaderMaterial,
  Vector3,
} from "three";
import { RGBELoader } from "three-stdlib";
import { ThemeKey, themes } from "./themeState";

const FLOOR_Z = -10.2;
/** Width over height of the rendered backplates (art/storefront/build_scene.py). */
const PLATE_ASPECT = 2.4;

type Prerendered = {
  /** How far the theme's platform raises the chairs, in metres. */
  lift: number;
  /** How dark the chairs' real-time shadows are on the rendered room. */
  shadow: number;
  /** The real-time sun's strength on the chairs. */
  sun: number;
};

export const prerendered: Partial<Record<ThemeKey, Prerendered>> = {
  scandi: { lift: 0.07, shadow: 0.22, sun: 0.8 },
  japandi: { lift: 0.06, shadow: 0.28, sun: 0.7 },
};

const plateUrl = (theme: ThemeKey) => `/storefront/${theme}/backplate.webp`;
const probeUrl = (theme: ThemeKey) => `/storefront/${theme}/probe.hdr`;

export const themeLift = (theme: ThemeKey) => prerendered[theme]?.lift ?? 0;

// The room drawn straight to the screen behind everything. The render shares
// the app camera's vertical field of view, so a narrower window only crops
// its sides.
function Backplate({ theme }: { theme: ThemeKey }) {
  const map = useTexture(plateUrl(theme));
  map.colorSpace = SRGBColorSpace;
  const aspect = useThree((state) => state.size.width / state.size.height);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { map: { value: null }, scale: { value: 1 } },
        vertexShader: /* glsl */ `
          uniform float scale;
          varying vec2 vUv;
          void main() {
            vUv = vec2(0.5 + position.x * 0.5 * scale, 0.5 + position.y * 0.5);
            gl_Position = vec4(position.xy, 1.0, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D map;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(map, vUv);
            #include <colorspace_fragment>
          }`,
        depthTest: false,
        depthWrite: false,
      }),
    []
  );
  material.uniforms.map.value = map;
  material.uniforms.scale.value = aspect / PLATE_ASPECT;
  return (
    <mesh material={material} frustumCulled={false} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

// Invisible floor and wall that only show the chairs' shadows.
function ShadowCatchers({ lift, opacity }: { lift: number; opacity: number }) {
  return (
    <>
      <mesh position={[0, -2, FLOOR_Z + lift + 0.001]} receiveShadow>
        <planeGeometry args={[20, 4]} />
        <shadowMaterial opacity={opacity} />
      </mesh>
      <mesh
        position={[0, -0.001, FLOOR_Z + 2]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 4]} />
        <shadowMaterial opacity={opacity} />
      </mesh>
    </>
  );
}

// The sun from the street window, along the same direction as the render's
// sun (build_scene.py SUN_DIR), so the chairs' shadows match the room's.
const SUN_DIR = new Vector3(-2.36612, -8.0653, 2.40629).normalize();
const ROW_CENTRE = new Vector3(0, -1.124, FLOOR_Z + 0.4);

function Sun({ intensity }: { intensity: number }) {
  const [target] = useState(() => {
    const object = new Object3D();
    object.position.copy(ROW_CENTRE);
    return object;
  });
  const position = ROW_CENTRE.clone().addScaledVector(SUN_DIR, 12);
  return (
    <>
      <primitive object={target} />
      <directionalLight
        position={position}
        target={target}
        intensity={intensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={4}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
        shadow-radius={4}
      />
    </>
  );
}

// Light the chairs with the room they stand in.
function RoomLight({ theme }: { theme: ThemeKey }) {
  const probe = useLoader(RGBELoader, probeUrl(theme));
  const scene = useThree((state) => state.scene);
  useEffect(() => {
    probe.mapping = EquirectangularReflectionMapping;
    scene.environment = probe;
    return () => {
      scene.environment = null;
    };
  }, [probe, scene]);
  return null;
}

// Fetch the other rendered rooms once the page is idle, so switching is quick.
function PreloadOthers({ theme }: { theme: ThemeKey }) {
  useEffect(() => {
    const preload = () =>
      themes.forEach(({ key }) => {
        if (key === theme || !prerendered[key]) return;
        useTexture.preload(plateUrl(key));
        useLoader.preload(RGBELoader, probeUrl(key));
      });
    const idle = window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1500));
    const handle = idle(preload);
    return () => (window.cancelIdleCallback ?? clearTimeout)(handle as number);
  }, [theme]);
  return null;
}

export function ThemeScene({ theme }: { theme: ThemeKey }) {
  const room = prerendered[theme];
  return (
    <>
      <PreloadOthers theme={theme} />
      {room && (
        <>
          <Backplate theme={theme} />
          <RoomLight theme={theme} />
          <ShadowCatchers lift={room.lift} opacity={room.shadow} />
          <Sun intensity={room.sun} />
        </>
      )}
    </>
  );
}
