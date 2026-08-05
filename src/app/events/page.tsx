import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WEDDING_ONLY_BASE_PATH } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events | Manas & Rupa #MR Wedding",
  description:
    "Five celebrations across two beautiful days — September 4 & 5, 2026.",
};

export default function EventsPage() {
  redirect(WEDDING_ONLY_BASE_PATH);
}
