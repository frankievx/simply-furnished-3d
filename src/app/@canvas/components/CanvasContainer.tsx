"use client";
import {
  CameraControls,
  Effects,
  FlyControls,
  GizmoHelper,
  GizmoViewport,
  Preload,
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
import { geometry } from "maath";

extend({ ShaderPass, MeshLineGeometry, MeshLineMaterial, ...geometry });

export function CanvasContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed w-screen h-dvh touch-none overflow-hidden">
      <Canvas
        camera={{
          position: [-0.011403, -5.26023, -2],
          rotation: new Euler(-0.3, 0, 0),
        }}
        resize={{ debounce: { scroll: 50, resize: 0 } }}
        shadows
      >
        {children}
        {/* <ambientLight intensity={0.5} /> */}
        {/* <CameraControlsWrapper /> */}
        {/* <GizmoContainer /> */}
        {/* <Stats /> */}
        {/* <Preload all /> */}
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
