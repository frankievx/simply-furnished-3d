import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CanvasContainer } from "@/app/@canvas/components/CanvasContainer";
import TheLoader from "./components/TheLoader";
import { DragIcon } from "./components/svgs/DragIcon";
import { ClickIcon } from "./components/svgs/ClickIcon";
import { TheGestureGuide } from "./components/TheGestureGuide";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simply Furnished",
  description: "Inspiring spaces start with the right furniture.",
  // colorScheme: "light",
};

export default function RootLayout({
  children,
  canvas,
}: Readonly<{
  children: React.ReactNode;
  canvas: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} select-none`}>
        {/* <TheLoader /> */}
        {/* <TheGestureGuide /> */}
        <CanvasContainer>{canvas}</CanvasContainer>
        {children}
      </body>
    </html>
  );
}
