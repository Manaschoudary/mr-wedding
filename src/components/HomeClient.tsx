"use client";

import Link from "next/link";
import { CalendarPlus, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DoorIntro, FallingPetals } from "@/components/DoorIntro";
import { Timeline } from "@/components/Timeline";
import { addGoogleCalendarInvite, downloadCalendarInvite, getGoogleCalendarUrl } from "@/lib/calendar";
import { getInvitationConfig, type InvitationMode, WEDDING, WEDDING_EVENT } from "@/lib/data";
import { useVisitAnalytics } from "@/lib/analytics";

interface HomeClientProps {
  readonly invitationMode: InvitationMode;
}

function Hero({ invitationMode }: HomeClientProps) {
  const invitation = getInvitationConfig(invitationMode);

  return (
    <section
      id="hero"
      data-analytics-section="Hero"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-32 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02, duration: 0.7 }}
        className="relative z-10 font-josefin text-[0.66rem] uppercase tracking-[0.32em] text-linen/82"
      >
        {invitation.showAllEvents ? "Wedding Celebrations" : "Marriage Ceremony"}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.85 }}
        className="relative z-10 mt-2 font-script text-[4rem] leading-[0.95] text-linen sm:text-[5.8rem] md:text-[6.6rem]"
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="relative z-10 mt-8 flex flex-col items-center gap-3 sm:flex-row"
      >
        <Link
          href={invitation.rsvpPath}
          className="rounded-full border border-linen/50 px-8 py-3 font-josefin text-[0.7rem] uppercase tracking-[0.28em] text-linen transition hover:border-olive hover:bg-olive"
        >
          RSVP
        </Link>
        <a
          href="#countdown"
          className="rounded-full border border-linen/25 px-8 py-3 font-josefin text-[0.7rem] uppercase tracking-[0.28em] text-linen/82 transition hover:border-linen/45 hover:text-linen"
        >
          Details
        </a>
      </motion.div>
    </section>
  );
}

function InvitationPreview() {
  return (
    <section className="section-tight" data-analytics-section="Invitation Preview">
      <ScrollReveal>
        <div className="rounded-2xl border border-linen/20 bg-burgundy-deep p-3 sm:p-6">
          <div className="olive-card p-4 text-center sm:p-8">
            <p className="caps-label text-[0.58rem] sm:text-[0.66rem]">{WEDDING.invitationTagline}</p>
            <p className="mt-3 serif-invite text-base leading-relaxed text-linen/95 sm:mt-4 sm:text-xl">{WEDDING.invitationText}</p>
            <div className="mt-6 border-t border-dashed border-linen/40 pt-4 sm:mt-7 sm:pt-5">
              <p className="cinzel-title text-[0.64rem] text-linen/86 sm:text-[0.72rem]">Sumuhurtham</p>
              <p className="mt-2 font-script text-[1.6rem] leading-none text-linen sm:text-[2rem]">September 5, 2026</p>
              <p className="font-script-alt text-2xl leading-none text-gold-dark sm:text-3xl">9:31 PM</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

function CalendarActions({ invitationMode }: HomeClientProps) {
  const invitation = getInvitationConfig(invitationMode);
  const events = invitation.events;

  return (
    <section data-analytics-section="Calendar Links" className="section-tight text-center">
      <ScrollReveal>
        <p className="font-josefin text-[0.66rem] uppercase tracking-[0.3em] text-linen/82">
          Save {invitation.showAllEvents ? "the dates" : "the date"}
        </p>
        <h2 className="mt-2 font-script text-5xl leading-none text-linen sm:text-6xl">
          Add to Calendar
        </h2>
        <div className="mx-auto mt-7 flex max-w-lg flex-col justify-center gap-3 sm:flex-row">
          {events.length === 1 ? (
            <a
              href={getGoogleCalendarUrl(events[0])}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.2em] text-linen transition hover:bg-olive-strong"
            >
              <CalendarPlus className="h-4 w-4" />
              Google Calendar
            </a>
          ) : (
            <button
              type="button"
              onClick={() => addGoogleCalendarInvite(events, {
                filename: "manas-rupa-full-celebration-google.ics",
                calendarName: "Manas & Rupa Full Celebration",
              })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.2em] text-linen transition hover:bg-olive-strong"
            >
              <CalendarPlus className="h-4 w-4" />
              Google Calendar
            </button>
          )}
          <button
            type="button"
            onClick={() => downloadCalendarInvite(events, {
              filename: invitation.showAllEvents ? "manas-rupa-full-celebration.ics" : "manas-rupa-wedding.ics",
              calendarName: invitation.showAllEvents ? "Manas & Rupa Full Celebration" : "Manas & Rupa Wedding",
            })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-linen/40 px-5 py-3 font-josefin text-[0.68rem] uppercase tracking-[0.2em] text-linen transition hover:bg-linen/10"
          >
            Apple / Outlook
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}

function WeddingOnlyDetails() {
  return (
    <>
      <KolamDivider />
      <section id="wedding-venue" data-analytics-section="Venue Details" className="section-wide">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-linen/45 bg-burgundy-deep p-4 sm:p-6">
            <div className="olive-card p-6 text-center sm:p-8">
              <p className="font-josefin text-[0.66rem] uppercase tracking-[0.3em] text-linen/82">Marriage Ceremony</p>
              <p className="mt-2 font-script text-5xl leading-none text-linen sm:text-6xl">{WEDDING_EVENT.name}</p>
              <p className="mx-auto mt-4 max-w-xl font-cormorant text-xl italic text-linen/92">
                {WEDDING_EVENT.dateLabel} · {WEDDING_EVENT.timeLabel}
              </p>
              <a
                href={WEDDING_EVENT.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-linen/35 px-5 py-2 font-josefin text-[0.66rem] uppercase tracking-[0.2em] text-linen/90 transition hover:bg-linen/10"
              >
                <MapPin className="h-4 w-4" />
                {WEDDING_EVENT.venue}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-3">
          {[
            ["Address", WEDDING_EVENT.address],
            ["Meal", WEDDING_EVENT.meal],
            ["Attire", WEDDING_EVENT.dressCode || "Traditional Indian Attire"],
          ].map(([label, value]) => (
            <ScrollReveal key={label}>
              <article className="rounded-2xl border border-dashed border-linen/42 bg-linen-soft p-5 text-center text-ink">
                <p className="font-josefin text-[0.62rem] uppercase tracking-[0.22em] text-ink/62">{label}</p>
                <p className="mt-2 font-cormorant text-[1.45rem] leading-tight italic text-ink">{value}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function HomeClient({ invitationMode }: HomeClientProps) {
  const invitation = getInvitationConfig(invitationMode);
  const { handleTrackedClick } = useVisitAnalytics({
    sections: [
      "Hero",
      "Countdown",
      invitation.showAllEvents ? "Events Timeline" : "Venue Details",
      "Calendar Links",
      ...(invitation.showAllEvents ? ["Invitation Preview"] : []),
    ],
    metadata: {
      invitationMode: invitation.mode,
      invitationLabel: invitation.label,
      inviteHomePath: invitation.homePath,
    },
  });

  return (
    <div onClickCapture={handleTrackedClick}>
      <DoorIntro />
      <FallingPetals />

      <Hero invitationMode={invitationMode} />
      <section id="countdown" data-analytics-section="Countdown" className="section-tight text-center">
        <ScrollReveal>
          <p className="font-josefin text-[0.66rem] uppercase tracking-[0.3em] text-linen/82">
            The countdown begins
          </p>
          <h2 className="mt-2 font-script text-5xl leading-none text-linen sm:text-6xl">September 5, 2026</h2>
          <div className="mt-6">
            <CountdownTimer targetDate={WEDDING.dates.weddingDate} />
          </div>
        </ScrollReveal>
      </section>

      {invitation.showAllEvents ? (
        <>
          <KolamDivider />
          <section id="events" data-analytics-section="Events Timeline">
            <Timeline events={invitation.events} />
          </section>
          <KolamDivider />
          <InvitationPreview />
          <KolamDivider />
          <section className="py-6 text-center">
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-linen/35 bg-gradient-to-br from-[#6f3832] to-[#402022] p-2 px-4 sm:px-6">
              <img
                src="/couple-mr.jpg"
                alt="Manas and Rupa"
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>
          </section>
        </>
      ) : (
        <WeddingOnlyDetails />
      )}

      <CalendarActions invitationMode={invitationMode} />
      <section className="section-tight pt-0 text-center">
        <Link
          href={invitation.rsvpPath}
          className="inline-flex rounded-full bg-olive px-8 py-3 font-josefin text-[0.72rem] uppercase tracking-[0.26em] text-linen transition hover:bg-olive-strong"
        >
          RSVP Now
        </Link>
      </section>
    </div>
  );
}
