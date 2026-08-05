import { AdminClient } from "@/components/AdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Manas & Rupa Wedding",
  description: "Owner dashboard for RSVPs and visit logs.",
};

export default function AdminPage() {
  return <AdminClient />;
}
