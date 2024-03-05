"use client";
import {
  CameraControls,
  Effects,
  FlyControls,
  GizmoHelper,
  GizmoViewport,
  Stats,
  StatsGl,
} from "@react-three/drei";
import { Canvas, extend } from "@react-three/fiber";
import { useRef } from "react";
import { GizmoContainer } from "./GizmoContainer";
import { Euler } from "three";
import { EffectComposer, SMAA, ToneMapping } from "@react-three/postprocessing";
import { GammaCorrectionShader } from "three-stdlib";
import { ShaderPass } from "three-stdlib";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ ShaderPass, MeshLineGeometry, MeshLineMaterial });

export function CanvasContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div className="flex w-dvw h-dvh">
      <Canvas
        ref={canvasRef}
        // gl={{
        //   outputColorSpace: THREE.LinearSRGBColorSpace
        // }}
        camera={{
          position: [-0.011403, -15.26023, 0.028015],
          rotation: new Euler(1.5708, 0, 0),
          fov: 75,
          focus: 100,
          aspect: 16 / 9,
        }}
        resize={{ debounce: { scroll: 50, resize: 0 } }}
        shadows
        // shadows={{
        //   mapSize: { width: 2048, height: 2048 },
        // }}
      >
        {children}
        {/* <ambientLight intensity={0.5} /> */}
        {/* <CameraControlsWrapper /> */}
        <GizmoContainer />
        {/* <Stats /> */}
        {/* <StatsGl /> */}
        {/* <EffectComposer disableNormalPass>
          <shaderPass attachArray="passes" args={[GammaCorrectionShader]} />
        </EffectComposer> */}
        {/* <SMAA /> */}
        {/* <ToneMapping /> */}
        {/* <EffectComposer> */}
        {/* </EffectComposer> */}
      </Canvas>
    </div>
  );
}
