import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding | Manas & Rupa Sree #MR Wedding",
  description: "Wedding-only invitation for the marriage ceremony of Manas and Rupa Sree.",
};

export default function WeddingPage() {
  return <HomeClient invitationMode="wedding-only" />;
}
