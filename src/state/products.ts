import { Vector3, Vector3Tuple } from "three";
import { SpringConfig, SpringRef, SpringValues } from "@react-spring/three";
import { atom } from "jotai";
import { Vector } from "three/examples/jsm/Addons.js";

export const products = [
  {
    position: [0.985018, -0.324315, 1.99496],
    rotation: [0, 0, 0],
    price: 130.9,
    title: "Axis Lounge",
    subtitle: "Chair, Brown",
  },
  {
    position: [-1.60492, -0.324315, 3.2508],
    rotation: [0, 0, 0],
    price: 280.0,
    title: "Zenith",
    subtitle: "Chair, Gray",
  },
  {
    position: [-4.5641, -0.324315, 1.73608],
    rotation: [0, 0, 0],
    price: 324.0,
    title: "Modesto",
    subtitle: "Chair, Gray",
  },
  {
    position: [-3.30586, -0.324315, -0.618965],
    rotation: [0, 0, 0],
    price: 149.1,
    title: "Tranquility",
    subtitle: "Chair, Gray",
  },
  {
    position: [-1.17419, -0.324315, -1.87536],
    rotation: [0, 0, 0],
    price: 1129.99,
    title: "Nova",
    subtitle: "Chair, Gray",
  },
  {
    position: [2.00777, -0.324315, -2.40859],
    rotation: [0, 0, 0],
    price: 721.99,
    title: "Aura Arc",
    subtitle: "Chair, Gray",
  },
  {
    position: [4.00979, -0.324315, -0.853277],
    rotation: [0, 0, 0],
    price: 220.0,
    title: "Echo Recliner",
    subtitle: "Chair, Gray",
  },
  {
    position: [3.90496, -0.324315, 2.95044],
    rotation: [0, 0, 0],
    price: 147.98,
    title: "Luna",
    subtitle: "Chair, Gray",
  },
].map(
  (item, i) =>
    ({
      ...item,
      i,
      order: i,
      show: true,
      shelf: true,
      shelfPosition: [0, 0, 0] as Vector3Tuple,
      slider: false,
      ring: true,
      sliderPoints: 0,
      sliderOpacity: 0,
      position: item.position as Vector3Tuple,
      rotation: item.rotation as Vector3Tuple,
      api: undefined,
    } as ProductType)
);
export const productsAtom = atom(products);
export const productsApiAtom = atom<ProductSpringRef | undefined>(undefined);

export const selectedProductAtom = atom<ProductSpring | undefined>(undefined);

export const relatedProductsAtom = atom(
  products.map((x) => ({
    ...x,
    position: [x.position[0], -0.24315, -10] as Vector3Tuple,
  }))
);
export const relatedProductsApiAtom = atom<ProductSpringRef | undefined>(
  undefined
);

export type ProductsType = typeof products;
export type ProductType = {
  i: number;
  price: number;
  title: string;
  subtitle: string;
  order: number;
  show: boolean;
  shelf: boolean;
  shelfPosition: Vector3Tuple;
  slider: boolean;
  ring: boolean;
  sliderPoints: number;
  sliderOpacity: number;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  delay?: number;
  config?: SpringConfig;
};

export type ProductSpring = SpringValues<ProductType>;
export type ProductSpringRef = SpringRef<Omit<ProductType, "config">>;
