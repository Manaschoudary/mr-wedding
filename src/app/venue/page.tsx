import { VENUES } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue | Manas & Rupa #MR Wedding",
  description: "Venue details for the #MR Wedding celebrations.",
};

export default function VenuePage() {
  return (
    <div className="min-h-screen pt-20">
      <KolamDivider />

      <section className="section-padding text-center max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Venue
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-12">
            Where We&apos;ll Celebrate
          </h2>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2">
          {VENUES.map((venue, i) => (
            <ScrollReveal key={venue.name} delay={i * 0.15}>
              <div className="bg-bg-secondary/60 rounded-2xl p-8 border border-gold/10 hover:border-gold/25 transition-all duration-300">
                <h3 className="font-serif text-2xl text-cream mb-3">
                  {venue.name}
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  {venue.description}
                </p>
                <a
                  href={venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-text-secondary text-sm hover:text-gold transition-colors"
                >
                  {venue.address}
                  <span className="block text-gold/70 text-xs mt-1">
                    Open in Maps →
                  </span>
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <KolamDivider />
    </div>
  );
}
