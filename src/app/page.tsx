import { redirect } from "next/navigation";
import { WEDDING_ONLY_BASE_PATH } from "@/lib/data";

export default function HomePage() {
  redirect(WEDDING_ONLY_BASE_PATH);
}
