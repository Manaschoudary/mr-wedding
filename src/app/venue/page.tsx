import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WEDDING_ONLY_BASE_PATH } from "@/lib/data";

export const metadata: Metadata = {
  title: "Venue | Manas & Rupa #MR Wedding",
  description: "Venue details for the Manas & Rupa wedding celebrations.",
};

export default function VenuePage() {
  redirect(WEDDING_ONLY_BASE_PATH);
}
