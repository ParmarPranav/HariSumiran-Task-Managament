import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
    "Futuristic, space-grade project management workspace with tactile drag-and-drop Kanban, live deadline countdown, and Supabase cloud persistence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased bg-background text-foreground font-sans tracking-normal`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
