import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
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
      className={`${playfair.variable} ${lato.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
