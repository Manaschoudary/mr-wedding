import { RSVPClient } from "@/components/RSVPClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSVP | Manas & Rupa Wedding",
  description: "RSVP for the Manas and Rupa marriage ceremony.",
};

export default function WeddingRSVPPage() {
  return <RSVPClient invitationMode="wedding-only" />;
}
