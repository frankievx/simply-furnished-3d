// import { ProductSpring, ProductSpringRef } from "@/state/products";
// import { easings } from "@react-spring/web";
// import { Vector3Tuple } from "three";

// const animateRelatedProductPositions = ({
//   relatedProductsSpring,
//   product,
// }: {
//   relatedProductsSpring: ProductSpringRef;
//   product: ProductSpring;
// }) => {
//   let selectedItem = relatedProductsSpring.current[product.i.get()].get();

//   // if (!selectedItem) return;
//   // setSelected(selectedItem);
//   const newFloorItems = getFloorItems({
//     displayItems: floorItems,
//     selected: selectedItem,
//   }).map((floorItem) => {
//     if (item.i.get() === floorItem.i) {
//       return {
//         ...floorItem,
//         rotation: [0, -0.5, 0] as Vector3Tuple,
//         config: { duration: 1500, easing: easings.easeOutQuad },
//         // config: {
//         //   mass: 18,
//         //   tension: 60,
//         //   friction: 60,
//         // },
//       };
//     } else if ([0, 7].includes(floorItem.order))
//       return { ...floorItem, config: { duration: 0 } };
//     return {
//       ...floorItem,
//       rotation: [0, 0, 0] as Vector3Tuple,
//       config: { duration: 1500, easing: easings.easeOutQuad },

//       // config: {
//       //   mass: 18,
//       //   tension: 60,
//       //   friction: 60,
//       // },
//     };
//   });
//   // floorItemsApi.start((i) => {
//   //   return newFloorItems[i];
//   // });
// };
