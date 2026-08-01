"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENTS } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";

function EventCard({ event, index }: { event: (typeof EVENTS)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        className={`event-card flip-card w-[300px] sm:w-[340px] h-[440px] ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFlipped(!flipped);
        }}
      >
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front bg-bg-secondary border border-gold/15 flex flex-col items-center justify-end p-6">
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/95 via-bg-primary/40 to-transparent rounded-xl" />
            <div className="relative z-10 text-center">
              <h3 className="font-serif text-2xl text-gold mb-2">
                {event.name}
              </h3>
              <p className="text-text-muted text-xs tracking-widest uppercase">
                Tap for details
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-bg-secondary border border-gold/15 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase mb-3">
              {event.subtitle}
            </p>
            <h3 className="font-serif text-2xl text-gold mb-4">
              {event.name}
            </h3>

            <div className="ornament-line w-16 mb-4" />

            <p className="text-cream text-sm font-serif mb-1">{event.date}</p>
            <p className="text-gold text-lg font-serif mb-4">{event.time}</p>

            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-xs hover:text-gold transition-colors mb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {event.venue}
              <br />
              {event.address}
              <span className="block text-gold/70 text-[10px] mt-1">
                Tap to open in Maps →
              </span>
            </a>

            {event.dressCode && (
              <div className="mt-4">
                <p className="text-text-muted text-[10px] tracking-[0.2em] uppercase mb-1">
                  Dress code
                </p>
                <p className="text-cream text-xs">{event.dressCode}</p>
              </div>
            )}

            <p className="text-text-muted text-xs mt-4 italic">
              {event.meal}
            </p>

            <p className="text-text-muted text-[10px] mt-4 animate-pulse-gold">
              Tap to close
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function EventsClient() {
  return (
    <div className="min-h-screen pt-20">
      <KolamDivider />

      <section className="section-padding text-center">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Celebrations
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-3">
            Wedding Functions
          </h2>
          <p className="text-text-secondary text-sm max-w-md mx-auto mb-12">
            Five celebrations across two beautiful days. Swipe or tap a card —
            tap again for details.
          </p>
        </ScrollReveal>

        {/* Horizontal scroll cards */}
        <div className="events-scroll px-4 sm:px-8 pb-4">
          {EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </section>

      <KolamDivider />
    </div>
  );
}
