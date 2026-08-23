import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const sansFont = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HariSumiran Task Management — Intelligent Productivity Workspace",
  description:
    "High-agency project management workspace with tactile drag-and-drop Kanban, multi-views, and command palette.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${sansFont.variable} ${monoFont.variable} antialiased bg-background text-foreground font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
