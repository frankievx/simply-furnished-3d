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
import { geometry } from "maath";

extend({ ShaderPass, MeshLineGeometry, MeshLineMaterial, ...geometry });

export function CanvasContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div className="flex w-screen h-screen">
      <Canvas
        ref={canvasRef}
        camera={{
          position: [-0.011403, -5.26023, 0.8],
          // rotation: new Euler(1.5517880408684726, 0, 0),
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
        {/* <GizmoContainer /> */}
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
