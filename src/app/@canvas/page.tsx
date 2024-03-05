"use client";
import { Environment, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useEffect } from "react";
import { Color, Euler } from "three";
import { Chair } from "@/app/@canvas/components/models/Chair";
import Product from "./components/Product/Product";
import { products } from "../../state/products";

export default function CanvasPage() {
  // const model = useGLTF("/models/chair-model.glb");
  // console.log("model", model);
  const { camera } = useThree();
  // const { position } = useControls("Camera", {
  //   position: {
  //     value: [-0.011403, -5.26023, 0.8],
  //     onChange: (value: [number, number, number]) => {
  //       camera.position.set(...value);
  //     },
  //   },
  // });

  return (
    <>
      {/* <ambientLight intensity={1} /> */}
      {/* <Environment background preset="dawn" blur={0.8} /> */}
      {/* <primitive
        object={model.scene}
        // position={[0.985018, -0.324315, 1.99496]}
        // rotation={new Euler(1.514537, 0, 0)}
      /> */}
      {/* <rectAreaLight
        color={new Color("#FCFFFF")}
        position={[-0.139672, -2.93715, 4.00862]}
        rotation={new Euler(1.5708, 0, 0)}
        intensity={0.5}
      /> */}
      {/* Light Straight */}
      <pointLight
        color={new Color("#FFFFFF")}
        position={[-7.36612, -8.0653, 4.40629]}
        intensity={1}
        power={1500}
        shadow-mapSize={[2048, 2048]}
        shadow-near={0.1}
        shadow-far={1}
        castShadow
      />
      <hemisphereLight color={new Color("#FFFFFF")} intensity={2.6} />
      {products.map((item, index) => (
        <Product key={index} position={item.position} castShadow />
      ))}
      {/* <DisplayItem position={[0.985018, -0.324315, 1.99496]} castShadow /> */}
      {/* <Chair position={[0.985018, -0.324315, 1.99496]} castShadow /> */}
      {/* <DisplayItem position={[-1.60492, -0.324315, 3.2508]} castShadow />
      <DisplayItem position={[-4.5641, -0.324315, 1.73608]} castShadow />
      <DisplayItem position={[-3.30586, -0.324315, -0.618965]} castShadow />
      <DisplayItem position={[-1.17419, -0.324315, -1.87536]} castShadow />
      <DisplayItem position={[2.00777, -0.324315, -2.40859]} castShadow />
      <DisplayItem position={[4.00979, -0.324315, -0.853277]} castShadow />
      <DisplayItem position={[3.90496, -0.324315, 2.95044]} castShadow /> */}

      <mesh rotation={new Euler(Math.PI / 2, 0, 0)} receiveShadow>
        <meshStandardMaterial color="#FFD468" />
        <planeGeometry args={[18.9, 19]} />
      </mesh>
    </>
  );
}
