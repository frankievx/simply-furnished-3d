import { GizmoHelper, GizmoViewport } from "@react-three/drei";

export function GizmoContainer() {
  return (
    <GizmoHelper
      alignment="bottom-right" // widget alignment within scene
      margin={[80, 80]} // widget margins (X, Y)
    >
      <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="black" />
    </GizmoHelper>
  );
}
