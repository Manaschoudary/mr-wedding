import { HomeClient } from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celebrations | Manas & Rupa Sree #MR Wedding",
  description: "Full celebration invitation for Manas and Rupa Sree's wedding events.",
};

export default function MarriageCelebrationsPage() {
  return <HomeClient invitationMode="full" />;
}
