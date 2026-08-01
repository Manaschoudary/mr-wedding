"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WEDDING, FAMILY } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";

export function InvitationClient() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="min-h-screen pt-20">
      <KolamDivider />

      <section className="section-padding text-center max-w-3xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-6">
            Tap the card to open our invitation
          </p>

          {/* Flip Card */}
          <div
            className={`flip-card mx-auto w-full max-w-md aspect-[3/4] ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setFlipped(!flipped);
            }}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front bg-bg-secondary border border-gold/20 flex flex-col items-center justify-center p-8">
                <div className="w-32 h-32 rounded-full border-2 border-gold/40 flex items-center justify-center mb-8">
                  <p className="font-serif text-4xl text-gold">
                    {WEDDING.couple.groom.firstName[0]}&amp;{WEDDING.couple.bride.firstName[0]}
                  </p>
                </div>
                <h2 className="font-serif text-3xl text-gold mb-2">
                  {WEDDING.couple.groom.firstName} &amp; {WEDDING.couple.bride.firstName}
                </h2>
                <p className="text-text-muted text-sm tracking-widest uppercase mt-4">
                  {WEDDING.hashtag}
                </p>
                <p className="text-text-muted text-xs mt-8 animate-pulse-gold">
                  Tap to open
                </p>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-bg-secondary border border-gold/20 flex flex-col items-center justify-center p-6 sm:p-8 overflow-y-auto">
                <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase mb-4">
                  {WEDDING.tagline}
                </p>

                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6 max-w-xs">
                  {WEDDING.invitationText}
                </p>

                {/* Bride */}
                <div className="mb-6 text-center">
                  <h3 className="font-serif text-2xl text-gold mb-1">
                    {WEDDING.couple.bride.firstName}
                  </h3>
                  <p className="text-cream text-sm mb-2">
                    {WEDDING.couple.bride.fullName}
                  </p>
                  {FAMILY.bride.map((member) => (
                    <p
                      key={member.role}
                      className="text-text-muted text-xs leading-relaxed"
                    >
                      {member.role} {member.name} {member.relation}
                    </p>
                  ))}
                </div>

                <p className="text-gold font-serif text-lg mb-4">and</p>

                {/* Groom */}
                <div className="mb-6 text-center">
                  <h3 className="font-serif text-2xl text-gold mb-1">
                    {WEDDING.couple.groom.firstName}
                  </h3>
                  <p className="text-cream text-sm mb-2">
                    {WEDDING.couple.groom.fullName}
                  </p>
                  {FAMILY.groom.map((member) => (
                    <p
                      key={member.role}
                      className="text-text-muted text-xs leading-relaxed"
                    >
                      {member.role} {member.name} {member.relation}
                    </p>
                  ))}
                </div>

                {/* Sumuhurtham */}
                <div className="ornament-line w-24 my-4" />
                <p className="text-text-muted text-[10px] tracking-[0.3em] uppercase mb-2">
                  Sumuhurtham
                </p>
                <p className="text-cream text-sm font-serif">
                  Saturday, September 5, 2026
                </p>
                <p className="text-gold text-lg font-serif">10:59 AM</p>

                <p className="text-text-muted text-xs mt-6 animate-pulse-gold">
                  Tap to close
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <KolamDivider />
    </div>
  );
}
