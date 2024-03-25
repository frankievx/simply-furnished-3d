import { ClickIcon } from "./svgs/ClickIcon";
import { DragIcon } from "./svgs/DragIcon";
import { getSelectorsByUserAgent } from "react-device-detect";
import { headers } from "next/headers";

export const TheGestureGuide = () => {
  const { isMobile } = getSelectorsByUserAgent(
    headers().get("user-agent") ?? ""
  );
  if (isMobile)
    return (
      <div className="z-20 absolute h-screen w-screen flex flex-col justify-end px-4 pointer-events-none">
        <div className="bg-white h-12 mb-4 rounded-md opacity-70 pointer-events-auto flex justify-around items-center gap-4 px-4">
          <div className="flex justify-center items-center gap-2">
            <DragIcon />
            <h3 className="flex-1 text-sm font-semibold"> Navigate</h3>
          </div>
          <div className="flex justify-center items-center gap-2">
            <ClickIcon />
            <h3 className="flex-1 text-sm font-semibold"> Select</h3>
          </div>
        </div>
      </div>
    );
};
