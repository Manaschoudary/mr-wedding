"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DoorIntro, FallingPetals } from "@/components/DoorIntro";
import { RSVPClient } from "@/components/RSVPClient";
import { Timeline } from "@/components/Timeline";
import { EVENTS, FAMILY, VENUES, WEDDING } from "@/lib/data";

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-28 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.85 }}
        className="relative z-10 font-script text-[4rem] leading-[0.95] text-linen sm:text-[5.8rem] md:text-[6.6rem]"
      >
        {WEDDING.couple.short}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="relative z-10 mt-5 font-josefin text-[0.72rem] uppercase tracking-[0.32em] text-linen/82 sm:text-[0.8rem]"
      >
        {WEDDING.line}
      </motion.p>

      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        href="#rsvp"
        className="relative z-10 mt-8 rounded-full border border-linen/50 px-8 py-3 font-josefin text-[0.7rem] uppercase tracking-[0.28em] text-linen transition hover:border-olive hover:bg-olive"
      >
        RSVP
      </motion.a>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="absolute bottom-8 z-10"
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
    <section id="invitation" className="section-tight text-center">
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
        <div className="rounded-2xl border border-linen/20 bg-burgundy-deep p-3 sm:p-6">
          <div className="olive-card p-4 text-center sm:p-8">
            <p className="caps-label text-[0.58rem] sm:text-[0.66rem]">{WEDDING.invitationTagline}</p>
            <p className="mt-3 serif-invite text-base leading-relaxed text-linen/95 sm:mt-4 sm:text-xl">{WEDDING.invitationText}</p>
            <div className="mt-6 grid grid-cols-1 items-end gap-4 sm:mt-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
              <div>
                <p className="font-script text-4xl leading-none text-linen sm:text-5xl">{WEDDING.couple.bride.firstName}</p>
                <p className="mt-2 font-josefin text-[0.6rem] uppercase tracking-[0.2em] text-linen/82 sm:text-[0.66rem]">Bride</p>
                {FAMILY.bride.map((member) => (
                  <p key={`${member.role}-${member.name}`} className="mt-1.5 font-cormorant text-sm italic leading-snug text-linen/94 sm:text-base">
                    <span className="font-josefin text-[0.56rem] uppercase tracking-[0.15em] text-linen/75 sm:text-[0.62rem]">{member.role}</span>{" "}
                    {member.name} {member.relation}
                  </p>
                ))}
              </div>
              <p className="pb-1 font-script-alt text-3xl leading-none text-gold-dark sm:text-4xl">and</p>
              <div>
                <p className="font-script text-4xl leading-none text-linen sm:text-5xl">{WEDDING.couple.groom.firstName}</p>
                <p className="mt-2 font-josefin text-[0.6rem] uppercase tracking-[0.2em] text-linen/82 sm:text-[0.66rem]">Groom</p>
                {FAMILY.groom.map((member) => (
                  <p key={`${member.role}-${member.name}`} className="mt-1.5 font-cormorant text-sm italic leading-snug text-linen/94 sm:text-base">
                    <span className="font-josefin text-[0.56rem] uppercase tracking-[0.15em] text-linen/75 sm:text-[0.62rem]">{member.role}</span>{" "}
                    {member.name} {member.relation}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-6 border-t border-dashed border-linen/40 pt-4 sm:mt-7 sm:pt-5">
              <p className="cinzel-title text-[0.64rem] text-linen/86 sm:text-[0.72rem]">Sumuhurtham</p>
              <p className="mt-2 font-script text-[1.6rem] leading-none text-linen sm:text-[2rem]">September 5, 2026</p>
              <p className="font-script-alt text-2xl leading-none text-gold-dark sm:text-3xl">9:30 PM</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function VenueSection() {
  return (
    <section id="venue" className="section-wide text-center">
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
  return null;
}

function RSVPSection() {
  return (
    <section id="rsvp" className="section-tight">
      <RSVPClient />
    </section>
  );
}

export function HomeClient() {
  return (
    <>
      {/* Door opening intro animation */}
      <DoorIntro />

      <FallingPetals />

      <Hero />
      <section id="countdown" className="section-tight text-center">
        <ScrollReveal>
          <CountdownTimer targetDate={WEDDING.dates.weddingDate} />
        </ScrollReveal>
      </section>
      <KolamDivider />
      <section id="events">
        <Timeline events={EVENTS} />
      </section>
      <KolamDivider />
      <InvitationPreview />
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
      <RSVPSection />
    </>
  );
}
