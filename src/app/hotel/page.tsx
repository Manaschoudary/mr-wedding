import { HOTEL } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel | Manas & Rupa #MR Wedding",
  description: "Recommended hotel and travel information for the #MR Wedding.",
};

export default function HotelPage() {
  return (
    <div className="min-h-screen pt-20">
      <KolamDivider />

      <section className="section-padding text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Where to Stay
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-12">
            Nearby Hotel
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-bg-secondary/60 rounded-2xl p-8 border border-gold/10 mb-8">
            <h3 className="font-serif text-2xl text-cream mb-3">
              {HOTEL.name}
            </h3>
            <p className="text-text-secondary text-sm mb-6">{HOTEL.address}</p>

            <ul className="text-text-secondary text-sm space-y-2 mb-8">
              {HOTEL.details.map((detail) => (
                <li key={detail} className="flex items-center justify-center gap-2">
                  <span className="text-gold text-xs">◈</span>
                  {detail}
                </li>
              ))}
            </ul>

            <a
              href={HOTEL.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-gold text-gold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-bg-primary transition-all duration-300"
            >
              Book your room
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="bg-bg-secondary/40 rounded-xl p-6 border border-gold/5">
            <p className="text-text-muted text-xs tracking-[0.2em] uppercase mb-2">
              Nearest Airport
            </p>
            <p className="text-cream font-serif text-lg">
              {HOTEL.airport.name}
            </p>
          </div>
        </ScrollReveal>
      </section>

      <KolamDivider />
    </div>
  );
}
