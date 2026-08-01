import { KolamDivider } from "@/components/KolamDivider";
import { HOTEL } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel | Manas & Rupa #MR Wedding",
  description: "Nearby hotel and airport guidance for the wedding celebration.",
};

export default function HotelPage() {
  return (
    <div className="pb-10 pt-24">
      <KolamDivider />
      <section className="section-tight text-center">
        <p className="font-script text-6xl leading-none text-linen">Nearby Hotel</p>
        <article className="mx-auto mt-7 max-w-3xl rounded-2xl border border-linen/30 bg-burgundy-deep p-7">
          <p className="font-cormorant text-4xl italic text-linen">{HOTEL.name}</p>
          <p className="mt-2 font-josefin text-sm text-linen/86">{HOTEL.address}</p>
          <ul className="mt-5 space-y-2">
            {HOTEL.details.map((line) => (
              <li key={line} className="font-josefin text-sm text-linen/9">
                {line}
              </li>
            ))}
          </ul>
          <a
            href={HOTEL.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-xl bg-olive px-6 py-3 font-josefin text-[0.7rem] uppercase tracking-[0.24em] text-linen transition hover:bg-olive-strong"
          >
            Reserve Stay
          </a>
        </article>

        <article className="mx-auto mt-5 max-w-3xl rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-6 text-ink">
          <p className="font-josefin text-[0.66rem] uppercase tracking-[0.22em]">Airport Info</p>
          <p className="mt-2 font-cormorant text-3xl italic">{HOTEL.airport.name}</p>
          <p className="mt-2 font-josefin text-sm">{HOTEL.airport.note}</p>
        </article>
      </section>
      <KolamDivider />
    </div>
  );
}
