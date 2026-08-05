import { RSVPClient } from "@/components/RSVPClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celebration RSVP | Manas & Rupa Sree Wedding",
  description: "RSVP for all Manas and Rupa Sree wedding celebrations.",
};

export default function MarriageCelebrationsRSVPPage() {
  return <RSVPClient invitationMode="full" />;
}
