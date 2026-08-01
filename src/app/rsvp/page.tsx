import { RSVPClient } from "@/components/RSVPClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSVP | Manas & Rupa #MR Wedding",
  description: "RSVP for the #MR Wedding — September 4 & 5, 2026.",
};

export default function RSVPPage() {
  return <RSVPClient />;
}
