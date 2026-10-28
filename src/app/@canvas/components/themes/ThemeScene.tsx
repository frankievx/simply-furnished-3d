import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  Color,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshDepthMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { HorizontalBlurShader, RGBELoader, VerticalBlurShader } from "three-stdlib";
import { ThemeKey, themes } from "./themeState";

/** Where the chairs' feet rest, as in the original room: the top of each
 * rendered room's platform (build_scene.py FEET_Z). */
const FLOOR_Z = -9.987;
/** Width over height of the rendered backplates (art/storefront/build_scene.py). */
const PLATE_ASPECT = 2.4;

type Prerendered = {
  /** How dark the chairs' real-time shadows are on the rendered room. */
  shadow: number;
  /** The real-time light's strength on the chairs. */
  sun: number;
  /** Where the room's main light comes from, matching the render. */
  light: Vector3;
  /** Lamps in the room that light the chairs as they pass. */
  lamps?: Vector3[];
};

const ROW_CENTRE = new Vector3(0, -1.124, FLOOR_Z + 0.4);

export const prerendered: Partial<Record<ThemeKey, Prerendered>> = {
  // The sun behind the back wall, shining down through the clerestory
  // (build_scene.py SCANDI_SUN, in the app's frame).
  scandi: { shadow: 0.2, sun: 1.1, light: new Vector3(0.9, 1.6, -3.857) },
  // Daylight through the street window behind the camera (SUN_DIR).
  japandi: {
    shadow: 0.28,
    sun: 0.7,
    light: ROW_CENTRE.clone().addScaledVector(
      new Vector3(-2.36612, -8.0653, 2.40629).normalize(),
      5
    ),
    // The andon lanterns' bulbs (build_scene.py japandi).
    lamps: [-2.25, 2.25].map((x) => new Vector3(x, -0.45, FLOOR_Z + 0.3)),
  },
};

const plateUrl = (theme: ThemeKey) => `/storefront/${theme}/backplate.webp`;
const probeUrl = (theme: ThemeKey) => `/storefront/${theme}/probe.hdr`;

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

// Invisible floor and wall that only show the chairs' shadows. The floor
// one covers just the platform (build_scene.py: y -1.7 to the wall), since
// the floor in front of it is lower. Its shadows are a little darker: the
// light hits it more directly than the wall.
function ShadowCatchers({ opacity }: { opacity: number }) {
  return (
    <>
      <mesh position={[0, -0.85, FLOOR_Z + 0.001]} receiveShadow>
        <planeGeometry args={[20, 1.7]} />
        <shadowMaterial opacity={Math.min(1, opacity * 1.5)} />
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

// Soft darkening where the legs meet the platform, which is what makes the
// chairs sit on it rather than hover. Like drei's ContactShadows, but that
// assumes y is up and blurs on a plane at the world origin, which this
// z-up scene never sees. An orthographic camera at the platform looks up and
// draws whatever is within `far` of it, fading with height; the result is
// blurred and laid on the platform, tinted the shadow colour.
const CONTACT = { width: 9, height: 1.7, far: 0.3, blur: 1.2, opacity: 0.8 };
const CONTACT_RES: [number, number] = [1536, 290];
const clearColor = new Color();

function ContactShadow() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const { width, height, far, blur, opacity } = CONTACT;
  const parts = useMemo(() => {
    const [w, h] = CONTACT_RES;
    const target = new WebGLRenderTarget(w, h);
    const scratch = new WebGLRenderTarget(w, h);
    // Looking up: an orthographic camera faces -z, so turn it over.
    const camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, far);
    camera.rotation.x = Math.PI;
    const depth = new MeshDepthMaterial();
    depth.depthTest = depth.depthWrite = false;
    depth.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "vec4( vec3( 1.0 - fragCoordZ ), opacity );",
        "vec4( vec3( 1.0 ), 1.0 - fragCoordZ );"
      );
    };
    const horizontal = new ShaderMaterial(HorizontalBlurShader);
    const vertical = new ShaderMaterial(VerticalBlurShader);
    const quad = new Mesh(new PlaneGeometry(2, 2), horizontal);
    const quadScene = new Scene();
    quadScene.add(quad);
    const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return { target, scratch, camera, depth, horizontal, vertical, quad, quadScene, quadCamera };
  }, [width, height, far]);
  const mesh = useRef<Mesh>(null);

  useEffect(
    () => () => {
      parts.target.dispose();
      parts.scratch.dispose();
      parts.depth.dispose();
      parts.horizontal.dispose();
      parts.vertical.dispose();
      parts.quad.geometry.dispose();
    },
    [parts]
  );

  useFrame(() => {
    const { target, scratch, camera, depth, horizontal, vertical, quad, quadScene, quadCamera } = parts;
    if (!mesh.current) return;
    camera.position.set(0, -0.9, FLOOR_Z - 0.005);
    camera.updateMatrixWorld();
    const background = scene.background;
    gl.getClearColor(clearColor);
    const clearAlpha = gl.getClearAlpha();
    mesh.current.visible = false;
    scene.background = null;
    scene.overrideMaterial = depth;
    gl.setRenderTarget(target);
    gl.setClearColor(0x000000, 0);
    gl.clear();
    gl.render(scene, camera);
    scene.overrideMaterial = null;
    scene.background = background;
    mesh.current.visible = true;
    for (const amount of [blur, blur * 0.4]) {
      quad.material = horizontal;
      horizontal.uniforms.tDiffuse.value = target.texture;
      horizontal.uniforms.h.value = amount / CONTACT_RES[0];
      gl.setRenderTarget(scratch);
      gl.render(quadScene, quadCamera);
      quad.material = vertical;
      vertical.uniforms.tDiffuse.value = scratch.texture;
      vertical.uniforms.v.value = amount / CONTACT_RES[1];
      gl.setRenderTarget(target);
      gl.render(quadScene, quadCamera);
    }
    gl.setRenderTarget(null);
    gl.setClearColor(clearColor, clearAlpha);
  });

  // The camera's image has +x to the right and -y (towards the viewer) up.
  return (
    <mesh
      ref={mesh}
      position={[0, -0.9, FLOOR_Z + 0.002]}
      rotation={[Math.PI, 0, 0]}
      renderOrder={1}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={parts.target.texture}
        color="#2a2118"
        transparent
        opacity={opacity}
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}

// The room's main light, a few metres away where the render's light comes
// from. Being near rather than a distant sun, each chair's shadow stretches
// and leans as it crosses the room instead of sliding along unchanged.
function Sun({ intensity, position }: { intensity: number; position: Vector3 }) {
  const [target] = useState(() => {
    const object = new Object3D();
    object.position.copy(ROW_CENTRE);
    return object;
  });
  // Wide enough to light the chairs in view and no wider, so the shadow map
  // stays sharp.
  const angle = Math.atan(4.5 / position.distanceTo(ROW_CENTRE));
  return (
    <>
      <primitive object={target} />
      <spotLight
        position={position}
        target={target}
        intensity={intensity}
        angle={angle}
        penumbra={0.4}
        decay={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={15}
        shadow-bias={-0.0003}
        shadow-normalBias={0.01}
      />
    </>
  );
}

// Warm light from the room's lamps, so a chair glows on the side facing one
// as it passes.
function Lamps({ positions }: { positions: Vector3[] }) {
  return (
    <>
      {positions.map((position) => (
        <pointLight
          key={position.x}
          position={position}
          color="#ffb067"
          intensity={0.6}
          distance={2.5}
          decay={2}
        />
      ))}
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
          <ShadowCatchers opacity={room.shadow} />
          <ContactShadow />
          <Sun intensity={room.sun} position={room.light} />
          {room.lamps && <Lamps positions={room.lamps} />}
        </>
      )}
    </>
  );
}
