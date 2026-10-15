import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CanvasContainer } from "@/app/@canvas/components/CanvasContainer";
import { DesktopOnly } from "./components/DesktopOnly";
import { TheApp } from "./components/TheApp";
import { assetProgressScript } from "./utils/assetProgressScript";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simply Furnished",
  description: "Inspiring spaces start with the right furniture.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: assetProgressScript }} />
      </head>
      <body
        className={`${inter.className} select-none h-dvh w-screen overflow-hidden`}
      >
        {/* <TheLoader /> */}
        <DesktopOnly>
          <CanvasContainer>{canvas}</CanvasContainer>
        </DesktopOnly>
        <TheApp>{children}</TheApp>
      </body>
    </html>
  );
}
