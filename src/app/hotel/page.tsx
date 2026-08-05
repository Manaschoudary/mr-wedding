import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { WEDDING_ONLY_BASE_PATH } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hotel | Manas & Rupa #MR Wedding",
  description: "Nearby hotel and airport guidance for the wedding celebration.",
};

export default function HotelPage() {
  redirect(WEDDING_ONLY_BASE_PATH);
}
