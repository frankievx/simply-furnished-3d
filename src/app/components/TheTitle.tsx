import { useAtomValue } from "jotai";
import { animated, config, useSpring, useTransition } from "@react-spring/web";
// import { showAtom } from "@/state/show";

export function TheTitle({ show }: { show?: boolean }) {
  const spring = useSpring({
    from: {
      opacity: 0,
      y: 300,
    },
    to: {
      opacity: 1,
      y: 0,
    },
    config: { duration: 2000 },
  });

  return (
    // <div className="absolute pointer-events-none py-auto px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
    <animated.div
      style={spring}
      className="flex flex-col  gap-8 sm:gap-16 items-center justify-center h-full"
    >
      <div className="flex justify-center gap-8 sm:text-3xl tracking-widest">
        <div>CHAIRS</div>
        <div>|</div>
        <div>SOFAS</div>
      </div>
      <h1 className="font-display italic text-6xl sm:text-7xl text-center">
        Simply Furnished
      </h1>
      <div className="text-sm text-center sm:text-lg font-extralight font-sans">
        <div>Inspiring spaces start with the right furniture.</div>
        <div>Experience the difference with our handcrafted pieces.</div>
      </div>
    </animated.div>
    // </div>
  );

  // return transitions((style, show) =>
  //   show ? (
  //     <animated.div
  //       className="absolute pointer-events-none py-auto px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
  //       style={{ ...style }}
  //     >
  //       <div className="flex flex-col gap-16 items-center justify-center h-full">
  //         <div className="flex justify-center gap-8 sm:text-3xl tracking-widest">
  //           <div>CHAIRS</div>
  //           <div>|</div>
  //           <div>SOFAS</div>
  //         </div>
  //         <h1 className="font-display italic text-6xl sm:text-7xl text-center">
  //           Simply Furnished
  //         </h1>
  //         <div className="text-sm text-center sm:text-lg font-extralight font-sans">
  //           <div>Inspiring spaces start with the right furniture.</div>
  //           <div>Experience the difference with our handcrafted pieces.</div>
  //         </div>
  //       </div>
  //     </animated.div>
  //   ) : null
  // );
}
