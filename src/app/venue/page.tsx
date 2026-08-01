import { KolamDivider } from "@/components/KolamDivider";
import { VENUES } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue | Manas & Rupa #MR Wedding",
  description: "Venue details for the Manas & Rupa wedding celebrations.",
};

export default function VenuePage() {
  return (
    <div className="pb-10 pt-24">
      <KolamDivider />
      <section className="section-wide text-center">
        <p className="font-script text-6xl leading-none text-linen">Where We&apos;ll Celebrate</p>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
          {VENUES.map((venue) => (
            <article key={venue.id} className="rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-6 text-left text-ink">
              <h2 className="font-cormorant text-[1.9rem] italic leading-none">{venue.name}</h2>
              <p className="mt-3 font-josefin text-sm">{venue.address}</p>
              <p className="mt-4 font-josefin text-[0.68rem] uppercase tracking-[0.18em] text-ink/72">{venue.note}</p>
            </article>
          ))}
        </div>
      </section>
      <KolamDivider />
    </div>
  );
}
