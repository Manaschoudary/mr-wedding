"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DoorIntro, FallingPetals } from "@/components/DoorIntro";
import { EVENTS, HOTEL, VENUES, WEDDING } from "@/lib/data";

function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-28 text-center">
      <motion.div
        aria-hidden
        className="absolute -left-8 top-24 h-20 w-20 rounded-full bg-olive/25 blur-2xl"
        animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-8 top-44 h-16 w-16 rounded-full bg-gold-dark/20 blur-xl"
        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="font-cinzel text-[2.2rem] leading-none text-linen sm:text-[2.8rem]"
      >
        {WEDDING.couple.monogram}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.85 }}
        className="mt-6 font-script text-[4rem] leading-[0.95] text-linen sm:text-[5.8rem] md:text-[6.6rem]"
      >
        {WEDDING.couple.short}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="mt-5 font-josefin text-[0.72rem] uppercase tracking-[0.32em] text-linen/82 sm:text-[0.8rem]"
      >
        {WEDDING.line}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="absolute bottom-8"
      >
        <a href="#countdown" className="inline-flex flex-col items-center gap-2 text-linen/85">
          <span className="font-josefin text-[0.64rem] uppercase tracking-[0.28em]">Scroll Down</span>
          <svg className="scroll-cue h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m6 10 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}

function InvitationEmblem() {
  return (
    <section className="section-tight text-center">
      <ScrollReveal>
        <Link href="/invitation" className="inline-flex flex-col items-center gap-4">
          <span className="grid h-56 w-56 place-items-center rounded-full border border-linen/45 bg-burgundy-deep sm:h-60 sm:w-60">
            <span className="grid h-[88%] w-[88%] place-items-center rounded-full border border-linen/25">
              <span>
                <span className="block font-script text-5xl leading-none text-linen">
                  {WEDDING.couple.short}
                </span>
                <span className="mt-2 block font-josefin text-[0.64rem] uppercase tracking-[0.3em] text-linen/82">
                  {WEDDING.hashtag}
                </span>
              </span>
            </span>
          </span>
          <span className="font-josefin text-[0.66rem] uppercase tracking-[0.28em] text-linen/86">
            Tap to open
          </span>
        </Link>
      </ScrollReveal>
    </section>
  );
}

function InvitationPreview() {
  return (
    <section className="section-tight">
      <ScrollReveal>
        <div className="rounded-2xl border border-linen/20 bg-burgundy-deep p-4 sm:p-6">
          <div className="olive-card p-6 text-center sm:p-8">
            <p className="caps-label">{WEDDING.invitationTagline}</p>
            <p className="mt-4 serif-invite text-xl text-linen/95">{WEDDING.invitationText}</p>
            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div>
                <p className="font-script text-5xl leading-none text-linen">{WEDDING.couple.bride.firstName}</p>
                <p className="mt-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em] text-linen/82">Bride</p>
              </div>
              <p className="pb-1 font-script-alt text-4xl leading-none text-gold-dark">and</p>
              <div>
                <p className="font-script text-5xl leading-none text-linen">{WEDDING.couple.groom.firstName}</p>
                <p className="mt-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em] text-linen/82">Groom</p>
              </div>
            </div>
            <div className="mt-7 border-t border-dashed border-linen/40 pt-5">
              <p className="cinzel-title text-[0.72rem] text-linen/86">Sumuhurtham</p>
              <p className="mt-2 font-script text-[2rem] leading-none text-linen">September 5, 2026</p>
              <p className="font-script-alt text-3xl leading-none text-gold-dark">10:59 AM</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function EventsTeaser() {
  const showcase = EVENTS.slice(0, 3);

  return (
    <section className="section-wide text-center">
      <ScrollReveal>
        <p className="font-script text-5xl leading-none text-linen sm:text-6xl">Wedding Functions</p>
      </ScrollReveal>
      <div className="event-stack-perspective mx-auto mt-8 max-w-4xl">
        <div className="relative mx-auto h-[20rem] w-full max-w-[18rem] sm:max-w-[20rem]">
          {showcase.map((event, index) => {
            const offset = index - 1;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="event-card-shell absolute inset-0"
                style={{
                  transform: `translateX(${offset * 28}px) translateY(${Math.abs(offset) * 10}px) scale(${1 - Math.abs(offset) * 0.08})`,
                  zIndex: 10 - Math.abs(offset),
                  filter: offset === 0 ? "none" : "brightness(0.72)",
                }}
              >
                <div className="relative h-[62%] overflow-hidden rounded-t-2xl">
                  <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a0f11]/60 to-transparent" />
                </div>
                <div className="flex h-[38%] flex-col items-center justify-center bg-burgundy px-4 text-center">
                  <p className="font-script text-4xl leading-none text-linen">{event.name}</p>
                  <p className="mt-3 font-josefin text-[0.62rem] uppercase tracking-[0.26em] text-linen/78">Tap for details</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="mt-8">
        <Link href="/events" className="rounded-full border border-linen/35 px-7 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.24em] text-linen transition hover:bg-olive hover:border-olive">
          Explore Events
        </Link>
      </div>
    </section>
  );
}

function VenueSection() {
  return (
    <section className="section-wide text-center">
      <ScrollReveal>
        <p className="font-script text-5xl leading-none text-linen sm:text-6xl">Where We&apos;ll Celebrate</p>
      </ScrollReveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {VENUES.map((venue) => (
          <ScrollReveal key={venue.id}>
            <article className="rounded-2xl border border-dashed border-linen/42 bg-linen-soft p-5 text-left text-ink">
              <h3 className="font-cormorant text-[1.75rem] leading-none italic">{venue.name}</h3>
              <p className="mt-2 font-josefin text-sm">{venue.address}</p>
              <p className="mt-3 font-josefin text-[0.7rem] uppercase tracking-[0.18em] text-ink/75">{venue.note}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function HotelSection() {
  return (
    <section className="section-tight text-center">
      <ScrollReveal>
        <p className="font-script text-5xl leading-none text-linen sm:text-6xl">Nearby Hotel</p>
      </ScrollReveal>
      <ScrollReveal className="mt-6">
        <article className="rounded-2xl border border-linen/25 bg-burgundy-deep p-6">
          <p className="font-cormorant text-[2rem] italic text-linen">{HOTEL.name}</p>
          <p className="mt-2 font-josefin text-sm text-linen/84">{HOTEL.address}</p>
          <ul className="mt-5 space-y-2">
            {HOTEL.details.map((detail) => (
              <li key={detail} className="font-josefin text-sm text-linen/88">{detail}</li>
            ))}
          </ul>
          <Link href="/hotel" className="mt-6 inline-flex rounded-full bg-olive px-6 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.24em] text-linen transition hover:bg-olive-strong">
            View Hotel Details
          </Link>
        </article>
      </ScrollReveal>
    </section>
  );
}

function RSVPSection() {
  return (
    <section className="section-tight text-center">
      <ScrollReveal>
        <p className="caps-label">Kindly Respond</p>
        <p className="mt-3 font-script text-6xl leading-none text-linen">RSVP</p>
        <p className="mt-4 font-josefin text-[0.7rem] uppercase tracking-[0.26em] text-linen/82">
          We look forward to celebrating with you
        </p>
        <Link href="/rsvp" className="mt-7 inline-flex w-full max-w-sm justify-center rounded-xl bg-olive px-6 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.24em] text-linen transition hover:bg-olive-strong">
          Send RSVP
        </Link>
      </ScrollReveal>
    </section>
  );
}

export function HomeClient() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      {/* Door opening intro animation */}
      <DoorIntro onComplete={handleIntroComplete} />

      {/* Falling petals (appear after doors open) */}
      {introComplete && <FallingPetals />}

      {/* Main content - hero animations delayed until doors open */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <Hero />
        <InvitationEmblem />
        <section id="countdown" className="section-tight text-center">
          <ScrollReveal>
            <CountdownTimer targetDate={WEDDING.dates.weddingDate} />
          </ScrollReveal>
        </section>
        <KolamDivider />
        <InvitationPreview />
        <KolamDivider />
        <EventsTeaser />
        <KolamDivider />
        <section className="section-tight text-center">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-linen/35 bg-gradient-to-br from-[#6f3832] to-[#402022] p-2">
              <img
                src="/couple.jpg"
                alt="Manas and Rupa"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
          </ScrollReveal>
        </section>
        <KolamDivider />
        <VenueSection />
        <KolamDivider />
        <HotelSection />
        <KolamDivider />
        <RSVPSection />
      </motion.div>
    </>
  );
}
