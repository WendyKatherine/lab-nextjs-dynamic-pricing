import type { Metadata } from "next";
import { Inter, VT323, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--rt-font-sans",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--rt-font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--rt-font-mono",
});

export const metadata: Metadata = {
  title: "lab-nextjs-dynamic-pricing",
  description: "Backend-driven quote calculation demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${vt323.variable} ${jetbrainsMono.variable} h-full antialiased`}
      data-rt-theme="phosphor"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
