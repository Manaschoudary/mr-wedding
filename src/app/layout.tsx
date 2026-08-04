import type { Metadata } from "next";
import {
  Cinzel,
  Cormorant_Garamond,
  Great_Vibes,
  Josefin_Sans,
  Pinyon_Script,
} from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Manas & Rupa | #MR Wedding",
  description:
    "Join us in celebrating the wedding of Manas Adusumilli and Rupa Sree Pamulapati — September 4 & 5, 2026.",
  openGraph: {
    title: "Manas & Rupa | #MR Wedding",
    description:
      "Join us in celebrating the wedding of Manas Adusumilli and Rupa Sree Pamulapati — September 4 & 5, 2026.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} ${cormorant.variable} ${cinzel.variable} ${greatVibes.variable} ${pinyon.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col overflow-x-hidden wedding-bg text-linen font-josefin">
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
