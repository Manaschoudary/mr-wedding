"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DoorIntro, FallingPetals } from "@/components/DoorIntro";
import { RSVPClient } from "@/components/RSVPClient";
import { EventsClient } from "@/components/EventsClient";
import { EVENTS, FAMILY, HOTEL, VENUES, WEDDING } from "@/lib/data";

function BananaTreeFrame({ side }: { side: "left" | "right" }) {
  const mirrored = side === "right";
  return (
    <div
      aria-hidden
      className={`absolute ${mirrored ? "-right-12 sm:-right-8" : "-left-12 sm:-left-8"} bottom-0 z-0 opacity-70 sm:opacity-85`}
    >
      <svg
        viewBox="0 0 220 430"
        className={`h-[15rem] w-[9rem] sm:h-[20rem] sm:w-[12rem] md:h-[24rem] md:w-[14rem] ${mirrored ? "-scale-x-100" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`banana-trunk-${side}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6c7a3f" />
            <stop offset="1" stopColor="#3d4f28" />
          </linearGradient>
          <linearGradient id={`banana-leaf-${side}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#91a95a" />
            <stop offset="1" stopColor="#4f6532" />
          </linearGradient>
        </defs>
        <path
          d="M112 428C107 356 103 272 108 188C112 124 118 67 126 24"
          stroke={`url(#banana-trunk-${side})`}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M114 176C86 137 49 124 16 118C42 110 74 96 94 72C108 98 117 136 114 176Z"
          fill={`url(#banana-leaf-${side})`}
          opacity="0.95"
        />
        <path
          d="M118 160C152 122 182 112 214 108C189 99 156 87 138 63C123 91 116 127 118 160Z"
          fill={`url(#banana-leaf-${side})`}
          opacity="0.95"
        />
        <path
          d="M116 126C92 95 67 84 36 78C58 73 84 64 100 42C112 62 120 91 116 126Z"
          fill={`url(#banana-leaf-${side})`}
          opacity="0.9"
        />
        <path
          d="M121 114C148 86 170 78 198 74C177 67 153 58 138 39C127 57 120 82 121 114Z"
          fill={`url(#banana-leaf-${side})`}
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

function GreeneryFlourish() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute left-[14%] top-[22%] z-0 h-3 w-3 rounded-full bg-[#8ca664]/45"
        animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
        transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[18%] top-[30%] z-0 h-2.5 w-2.5 rounded-full bg-[#73874b]/45"
        animate={{ y: [0, 4, 0], x: [0, -2, 0] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[20%] left-[22%] z-0 h-10 w-5 rounded-[100%_35%_90%_40%] border border-[#8fa55c]/40 bg-[#6e8345]/20"
        animate={{ rotate: [-8, 7, -8] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[28%] right-[20%] z-0 h-9 w-4 rounded-[100%_25%_85%_35%] border border-[#7f9754]/40 bg-[#5d723b]/20"
        animate={{ rotate: [10, -7, 10] }}
        transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function Hero() {
  return (
    <section id="hero" className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-28 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <BananaTreeFrame side="left" />
        <BananaTreeFrame side="right" />
        <GreeneryFlourish />
      </div>

      <motion.div
        aria-hidden
        className="absolute -left-8 top-24 z-0 h-20 w-20 rounded-full bg-olive/25 blur-2xl"
        animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute right-8 top-44 z-0 h-16 w-16 rounded-full bg-gold-dark/20 blur-xl"
        animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 font-cinzel text-[2.2rem] leading-none text-linen sm:text-[2.8rem]"
      >
        {WEDDING.couple.monogram}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.85 }}
        className="relative z-10 mt-6 font-script text-[4rem] leading-[0.95] text-linen sm:text-[5.8rem] md:text-[6.6rem]"
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
        <div className="rounded-2xl border border-linen/20 bg-burgundy-deep p-4 sm:p-6">
          <div className="olive-card p-6 text-center sm:p-8">
            <p className="caps-label">{WEDDING.invitationTagline}</p>
            <p className="mt-4 serif-invite text-xl text-linen/95">{WEDDING.invitationText}</p>
            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <div>
                <p className="font-script text-5xl leading-none text-linen">{WEDDING.couple.bride.firstName}</p>
                <p className="mt-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em] text-linen/82">Bride</p>
                {FAMILY.bride.map((member) => (
                  <p key={`${member.role}-${member.name}`} className="mt-2 font-cormorant text-base italic text-linen/94">
                    <span className="font-josefin text-[0.62rem] uppercase tracking-[0.18em] text-linen/75">{member.role}</span>{" "}
                    {member.name} {member.relation}
                  </p>
                ))}
              </div>
              <p className="pb-1 font-script-alt text-4xl leading-none text-gold-dark">and</p>
              <div>
                <p className="font-script text-5xl leading-none text-linen">{WEDDING.couple.groom.firstName}</p>
                <p className="mt-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em] text-linen/82">Groom</p>
                {FAMILY.groom.map((member) => (
                  <p key={`${member.role}-${member.name}`} className="mt-2 font-cormorant text-base italic text-linen/94">
                    <span className="font-josefin text-[0.62rem] uppercase tracking-[0.18em] text-linen/75">{member.role}</span>{" "}
                    {member.name} {member.relation}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-7 border-t border-dashed border-linen/40 pt-5">
              <p className="cinzel-title text-[0.72rem] text-linen/86">Sumuhurtham</p>
              <p className="mt-2 font-script text-[2rem] leading-none text-linen">September 5, 2026</p>
              <p className="font-script-alt text-3xl leading-none text-gold-dark">9:30 PM</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function EventsTeaser() {
  return <EventsClient />;
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
  return (
    <section id="hotel" className="section-tight text-center">
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
      <InvitationEmblem />
      <section id="countdown" className="section-tight text-center">
        <ScrollReveal>
          <CountdownTimer targetDate={WEDDING.dates.weddingDate} />
        </ScrollReveal>
      </section>
      <KolamDivider />
      <InvitationPreview />
      <KolamDivider />
      <section id="events">
        <EventsTeaser />
      </section>
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
    </>
  );
}
