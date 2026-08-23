import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const madeMirage = localFont({
  src: [
    {
      path: "../../public/fonts/MADEMirage-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/MADEMirage-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/MADEMirage-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/MADEMirage-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/MADEMirage-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-made-mirage",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HariSumiran — Modern Sprint & Workspace Mission Control",
  description:
    "High-agency project management workspace styled with MADE Mirage, tactile drag-and-drop Kanban, live deadline countdown, and Supabase cloud persistence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${madeMirage.variable} ${spaceGrotesk.variable} ${spaceMono.variable} antialiased bg-background text-foreground font-mirage tracking-wide`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
