import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

const title = "Wedding | Manas & Rupa Sree #MR Wedding";
const description =
  "Wedding-only invitation for the marriage ceremony of Manas and Rupa Sree.";
const shareImageUrl = "https://www.manaswedsrupa.com/mr-share-preview-ganesh.jpg";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://www.manaswedsrupa.com/wedding",
    siteName: "Manas & Rupa Sree Wedding",
    images: [
      {
        url: shareImageUrl,
        width: 1200,
        height: 630,
        alt: "Lord Ganesh wedding artwork",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImageUrl],
  },
};

export default function WeddingPage() {
  return <HomeClient invitationMode="wedding-only" />;
}
