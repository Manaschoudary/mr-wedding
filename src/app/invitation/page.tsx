import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WEDDING_ONLY_BASE_PATH } from "@/lib/data";

export const metadata: Metadata = {
  title: "Invitation | Manas & Rupa #MR Wedding",
  description: "You are cordially invited to the wedding of Manas Adusumilli and Rupa Sree Pamulapati.",
};

export default function InvitationPage() {
  redirect(WEDDING_ONLY_BASE_PATH);
}
