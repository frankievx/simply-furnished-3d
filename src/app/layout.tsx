import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CanvasContainer } from "@/app/@canvas/components/CanvasContainer";
import { Leva } from "leva";
import { TheScrollNavigation } from "./components/TheScrollNavigation";

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
      <body className={inter.className}>
        <TheScrollNavigation />
        <CanvasContainer>{canvas}</CanvasContainer>
        {children}
      </body>
    </html>
  );
}
