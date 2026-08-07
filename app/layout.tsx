import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono, Fraunces } from "next/font/google";
import { AnalyticsConsent } from "./AnalyticsConsent";
import { StructuredData } from "./StructuredData";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = Roboto_Mono({ variable: "--font-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cinema-estate.vercel.app"),
  title: "Cinema Estate — Real listing photos, cinematic marketing",
  description: "Cinema Estate turns real listing photography into a cinematic marketing package for agents.",
  openGraph: { title: "Cinema Estate", description: "Real listing photos, cinematic marketing.", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "Cinema Estate", description: "Real listing photos, cinematic marketing.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "https://cinema-estate.vercel.app" },
};

export const viewport: Viewport = { themeColor: "#16130F", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${mono.variable} ${fraunces.variable}`}>{children}<AnalyticsConsent /><StructuredData /></body></html>;
}
