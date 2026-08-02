"use client";

import { FAMILY, WEDDING } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";

export function InvitationClient() {
  return (
    <div className="pb-10 pt-24">
      <KolamDivider />
      <section className="section-tight">
        <ScrollReveal>
          <div className="rounded-2xl border border-dashed border-linen/50 bg-burgundy-deep p-4 sm:p-6">
            <div className="olive-card p-5 sm:p-9">
              <p className="text-center font-josefin text-[0.66rem] uppercase tracking-[0.32em] text-linen/86">
                {WEDDING.invitationTagline}
              </p>

              <p className="mt-6 text-center font-cormorant text-2xl italic leading-relaxed text-linen/96 sm:text-[1.75rem]">
                {WEDDING.invitationText}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-5 sm:mt-8 sm:gap-7 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <div className="text-center md:text-left">
                  <p className="font-script text-6xl leading-none text-linen sm:text-7xl">{WEDDING.couple.bride.firstName}</p>
                  <p className="mt-2 font-josefin text-[0.7rem] uppercase tracking-[0.2em] text-linen/88">
                    {WEDDING.couple.bride.fullName}
                  </p>
                  <div className="mt-4 space-y-1.5 font-cormorant text-lg italic text-linen/95">
                    {FAMILY.bride.map((line) => (
                      <p key={line.role}>
                        <span className="font-josefin text-[0.7rem] uppercase tracking-[0.15em] text-linen/75">{line.role}</span>{" "}
                        {line.line}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="text-center font-script-alt text-5xl leading-none text-gold-dark">and</p>

                <div className="text-center md:text-right">
                  <p className="font-script text-6xl leading-none text-linen sm:text-7xl">{WEDDING.couple.groom.firstName}</p>
                  <p className="mt-2 font-josefin text-[0.7rem] uppercase tracking-[0.2em] text-linen/88">
                    {WEDDING.couple.groom.fullName}
                  </p>
                  <div className="mt-4 space-y-1.5 font-cormorant text-lg italic text-linen/95">
                    {FAMILY.groom.map((line) => (
                      <p key={line.role}>
                        <span className="font-josefin text-[0.7rem] uppercase tracking-[0.15em] text-linen/75">{line.role}</span>{" "}
                        {line.line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-dashed border-linen/45 pt-6 text-center">
                <p className="cinzel-title text-[0.75rem] text-linen/9">SUMUHURTHAM</p>
                <p className="mt-3 font-script text-[2.4rem] leading-none text-linen">September 5, 2026</p>
                <p className="font-script-alt text-[2rem] leading-none text-gold-dark">10:59 AM</p>
              </div>

              <p className="mt-7 text-center font-josefin text-[0.7rem] uppercase tracking-[0.32em] text-linen/82">
                {WEDDING.hashtag}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
      <KolamDivider />
    </div>
  );
}
