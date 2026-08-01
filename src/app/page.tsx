import { WEDDING, VENUES, HOTEL } from "@/lib/data";
import { HomeClient } from "@/components/HomeClient";

export default function HomePage() {
  return (
    <HomeClient
      wedding={WEDDING}
      venues={VENUES}
      hotel={HOTEL}
    />
  );
}
