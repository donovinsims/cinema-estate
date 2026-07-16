import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = Roboto_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cinema Estate — Real listing photos, cinematic marketing",
  description: "Cinema Estate turns real listing photography into a cinematic marketing package for agents.",
  openGraph: { title: "Cinema Estate", description: "Real listing photos, cinematic marketing.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Cinema Estate", description: "Real listing photos, cinematic marketing.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${mono.variable}`}>{children}</body></html>;
}
