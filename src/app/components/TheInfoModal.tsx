// import { animated, useSpring } from "@react-spring/web";
export const TheInfoModal = ({ onDismiss }: { onDismiss: () => void }) => {
  return (
    <div className="absolute h-dvh w-screen flex flex-col justify-center items-center z-30 pointer-events-auto gap-4 sm:gap-8 top-4">
      <div className="bg-[#D2BE9D] bg-opacity-[0.90] w-3/4 h-3/4 sm:h-1/2 sm:w-1/3 rounded-lg flex flex-col justify-around items-center gap-8 relative py-16 px-8">
        <h1 className="text-2xl font-bold"> Credits</h1>
        <div className="flex flex-col gap-8">
          <div className="text-normal">
            <h2 className="font-semibold text-lg">Inspiration</h2>
            <a
              className="text-white text-sm"
              href="https://dribbble.com/shots/19830137-Chairs-Sofas-Furniture-Store?utm_source=Clipboard_Shot&utm_campaign=TheGlyphStudio&utm_content=Chairs%20%26%20Sofas.%20Furniture%20Store&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=TheGlyphStudio&utm_content=Chairs%20%26%20Sofas.%20Furniture%20Store&utm_medium=Social_Share"
            >
              @The Glyph
            </a>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">3D Artists</h2>
            <h3 className="text-normal">Parnian Javid</h3>
            <a className="text-white text-sm" href="https://parnianjavid.com/">
              https://parnianjavid.com/
            </a>
            <h3 className="text-sm">IG: parnian.art3d</h3>
          </div>
        </div>
      </div>
      <button
        className="flex-shrink text-normal bg-transparent hover:bg-[#D2BE9D] rounded-lg px-3 py-2 "
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
};
