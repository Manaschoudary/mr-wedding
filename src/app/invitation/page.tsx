import { InvitationClient } from "@/components/InvitationClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invitation | Manas & Rupa #MR Wedding",
  description: "You are cordially invited to the wedding of Manas Adusumilli and Rupa Sree Pamulapati.",
};

export default function InvitationPage() {
  return <InvitationClient />;
}
