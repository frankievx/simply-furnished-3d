// import { showAtom } from "@/state/show";
// import { useTransition } from "@react-spring/web";
// import { animated as animated3 } from "@react-spring/three";
// import { Billboard, Text, useMask } from "@react-three/drei";
// import { useAtomValue } from "jotai";
// export function ProductTitle() {
//   const stencil = useMask(1, true);
//   const stencil2 = useMask(1, false);
//   const show = useAtomValue(showAtom);
//   const transition = useTransition(show.itemTitles, {
//     from: { opacity: 0 },
//     enter: { opacity: 1 },
//     leave: { opacity: 0 },
//     config: { duration: 800 },
//   });
//   return transition(
//     (style, show) =>
//       show && (
//         <Billboard position={[0, 1.3, -0.2]}>
//           <Text
//             color="black"
//             anchorX="center"
//             anchorY="top"
//             fontSize={0.15}
//             font={"/fonts/casanova.ttf"}
//           >
//             Axis Lounge
//             {/*@ts-ignore */}
//             <animated3.meshBasicMaterial {...stencil} opacity={style.opacity} />
//           </Text>
//           <Text
//             position={[0, -0.02, 0]}
//             color="black"
//             anchorX="center"
//             anchorY="top"
//             fontSize={0.2}
//             font={"/fonts/casanova.ttf"}
//           >
//             Axis Lounge
//             <animated3.meshBasicMaterial
//               {...stencil2}
//               opacity={style.opacity}
//             />
//           </Text>
//         </Billboard>
//       )
//   );
// }
