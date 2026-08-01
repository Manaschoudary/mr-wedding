"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { WEDDING as WeddingType, VENUES as VenuesType, HOTEL as HotelType } from "@/lib/data";

interface HomeClientProps {
  wedding: typeof WeddingType;
  venues: typeof VenuesType;
  hotel: typeof HotelType;
}

export function HomeClient({ wedding, venues, hotel }: HomeClientProps) {
  const weddingDate = new Date(wedding.dates.weddingDate);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16">
        {/* Decorative top kolam */}
        <KolamDivider className="mb-4" />

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-text-muted text-xs tracking-[0.4em] uppercase mb-6"
        >
          {wedding.hashtag}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl text-gold leading-tight"
        >
          {wedding.couple.groom.firstName}
          <span className="block text-2xl sm:text-3xl text-text-muted font-sans font-light my-2">
            &amp;
          </span>
          {wedding.couple.bride.firstName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 space-y-2"
        >
          <p className="text-text-secondary text-sm tracking-widest uppercase">
            We&apos;re getting married
          </p>
          <p className="text-cream text-lg font-serif">
            {wedding.dates.day1} &amp; {wedding.dates.day2.replace("September ", "")}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <Link
            href="#countdown"
            className="flex flex-col items-center gap-2 text-text-muted hover:text-gold transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Scroll Down</span>
            <motion.svg
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section id="countdown" className="section-padding text-center">
        <ScrollReveal>
          <CountdownTimer targetDate={weddingDate} />
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* Invitation Teaser */}
      <section className="section-padding text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Tap the emblem to open our invitation
          </p>
          <Link
            href="/invitation"
            className="inline-block group"
          >
            <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:border-gold/60 transition-colors duration-500 bg-bg-secondary/50">
              <div className="text-center">
                <p className="font-serif text-3xl text-gold">
                  {wedding.couple.groom.firstName[0]}&amp;{wedding.couple.bride.firstName[0]}
                </p>
                <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase mt-2">
                  Tap to open
                </p>
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* About Section */}
      <section className="section-padding text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-6">
            {wedding.tagline}
          </p>
          <p className="text-text-secondary leading-relaxed mb-8">
            {wedding.invitationText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div>
              <h3 className="font-serif text-3xl text-gold mb-1">
                {wedding.couple.bride.firstName}
              </h3>
              <p className="text-text-muted text-sm">
                {wedding.couple.bride.fullName}
              </p>
            </div>
            <span className="text-gold text-2xl font-serif hidden sm:block">&amp;</span>
            <span className="text-gold text-lg font-serif sm:hidden">and</span>
            <div>
              <h3 className="font-serif text-3xl text-gold mb-1">
                {wedding.couple.groom.firstName}
              </h3>
              <p className="text-text-muted text-sm">
                {wedding.couple.groom.fullName}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* Sumuhurtham */}
      <section className="section-padding text-center">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Sumuhurtham
          </p>
          <p className="font-serif text-2xl sm:text-3xl text-cream mb-2">
            Saturday, September 5, 2026
          </p>
          <p className="text-gold text-xl font-serif">10:59 AM</p>
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* Venue Preview */}
      <section className="section-padding text-center max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Venue
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-10">
            Where We&apos;ll Celebrate
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {venues.map((venue, i) => (
              <div
                key={venue.name}
                className="bg-bg-secondary/50 rounded-xl p-6 border border-gold/10 hover:border-gold/25 transition-colors"
              >
                <h3 className="font-serif text-xl text-cream mb-2">
                  {venue.name}
                </h3>
                <p className="text-text-muted text-sm">{venue.address}</p>
              </div>
            ))}
          </div>
          <Link
            href="/venue"
            className="inline-block mt-8 text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            View Details →
          </Link>
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* Hotel Preview */}
      <section className="section-padding text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Where to Stay
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-gold mb-6">
            Nearby Hotel
          </h2>
          <div className="bg-bg-secondary/50 rounded-xl p-6 border border-gold/10">
            <h3 className="font-serif text-xl text-cream mb-2">{hotel.name}</h3>
            <p className="text-text-muted text-sm mb-4">{hotel.address}</p>
            <ul className="text-text-secondary text-sm space-y-1">
              {hotel.details.map((detail) => (
                <li key={detail}>◈ {detail}</li>
              ))}
            </ul>
          </div>
          <Link
            href="/hotel"
            className="inline-block mt-8 text-gold text-sm tracking-widest uppercase hover:text-gold-light transition-colors"
          >
            View Details →
          </Link>
        </ScrollReveal>
      </section>

      <KolamDivider />

      {/* RSVP CTA */}
      <section className="section-padding text-center">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Kindly Respond
          </p>
          <h2 className="font-serif text-4xl text-gold mb-6">RSVP</h2>
          <p className="text-text-secondary mb-8">
            We look forward to celebrating with you
          </p>
          <Link
            href="/rsvp"
            className="inline-block px-10 py-3 border border-gold text-gold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-bg-primary transition-all duration-300"
          >
            Respond Now
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
