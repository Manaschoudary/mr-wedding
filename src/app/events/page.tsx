import { EventsClient } from "@/components/EventsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Manas & Rupa #MR Wedding",
  description:
    "Five celebrations across two beautiful days — September 4 & 5, 2026.",
};

export default function EventsPage() {
  return <EventsClient />;
}
