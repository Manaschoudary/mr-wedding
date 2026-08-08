import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

const title = "Celebrations | Manas & Rupa Sree #MR Wedding";
const description =
  "Full celebration invitation for Manas and Rupa Sree's wedding events.";
const shareVersion = "v4";
const shareImageUrl = "https://www.manaswedsrupa.com/mr-share-preview-ganesh-v4.jpg";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `https://www.manaswedsrupa.com/marriage/celebrations?v=${shareVersion}`,
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

export default function MarriageCelebrationsPage() {
  return <HomeClient invitationMode="full" />;
}
