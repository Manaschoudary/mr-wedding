import { ConcludedClient } from "@/components/ConcludedClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Manas & Rupa Sree",
  description: "The wedding celebration of Manas and Rupa Sree has concluded.",
};

export default function HomePage() {
  return <ConcludedClient />;
}
