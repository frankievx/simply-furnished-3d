import { useAtomValue } from "jotai";
import { animated, config, useTransition } from "@react-spring/web";
import { showAtom } from "@/state/show";

export function Title() {
  const show = useAtomValue(showAtom);
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1, config: config.slow },
    leave: { opacity: 0, config: config.slow },
  });

  return transitions((style, show) =>
    show.title ? (
      <animated.div
        className="absolute pointer-events-none py-auto px-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black"
        style={{ ...style }}
      >
        <div className="flex flex-col gap-16 items-center justify-center h-full">
          <div className="flex justify-center gap-8 sm:text-3xl tracking-widest">
            <div>CHAIRS</div>
            <div>|</div>
            <div>SOFAS</div>
          </div>
          <h1 className="font-casanova italic text-4xl sm:text-7xl ">
            Simply Furnished
          </h1>
          <div className="text-sm text-center sm:text-lg font-extralight font-sans">
            <div>Inspiring spaces start with the right furniture.</div>
            <div>Experience the difference with our handcrafted pieces.</div>
          </div>
        </div>
      </animated.div>
    ) : null
  );
}
