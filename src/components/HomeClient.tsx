"use client";

import Link from "next/link";
import { CalendarPlus, Clock, MapPin, Shirt, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { CountdownTimer } from "@/components/CountdownTimer";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { DoorIntro } from "@/components/DoorIntro";
import { Timeline } from "@/components/Timeline";
import { addGoogleCalendarInvite, downloadCalendarInvite, getGoogleCalendarUrl } from "@/lib/calendar";
import { FAMILY, getInvitationConfig, type InvitationMode, WEDDING, WEDDING_EVENT } from "@/lib/data";
import { useVisitAnalytics } from "@/lib/analytics";

interface HomeClientProps {
  readonly invitationMode: InvitationMode;
}

function Hero({ invitationMode }: HomeClientProps) {
  const invitation = getInvitationConfig(invitationMode);
  const detailsHref = invitation.showAllEvents ? "#events" : "#wedding-venue";

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
        className="relative z-10 font-josefin text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-linen/92"
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
        className="relative z-10 mt-5 font-josefin text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-linen/92 sm:text-[0.8rem]"
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
          className="action-button action-button--primary"
        >
          RSVP
        </Link>
        <a
          href={detailsHref}
          className="action-button action-button--ghost"
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
        <div className="mx-auto max-w-[40rem] rounded-2xl border border-dashed border-linen/50 bg-burgundy-deep p-3 sm:p-5">
          <div className="olive-card p-4 sm:p-7">
            <p className="text-center font-josefin text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-linen/92 sm:text-[0.64rem]">
              {WEDDING.invitationTagline}
            </p>

            <p className="mt-5 text-center font-cormorant text-xl italic leading-relaxed text-linen/96 sm:text-[1.45rem]">
              {WEDDING.invitationText}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div className="text-center md:text-left">
                <p className="font-script text-5xl leading-none text-linen sm:text-6xl">{WEDDING.couple.bride.firstName}</p>
                <p className="mt-2 font-josefin text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-linen/92">
                  {WEDDING.couple.bride.fullName}
                </p>
                <div className="mt-3 space-y-1.5 font-cormorant text-base italic text-linen/95 sm:text-[1.05rem]">
                  {FAMILY.bride.map((line) => (
                    <p key={`${line.role}-${line.name}`}>
                      <span className="font-josefin text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-linen/88">{line.role}</span>{" "}
                      {line.name} {line.relation}
                    </p>
                  ))}
                </div>
              </div>

              <p className="text-center font-script-alt text-4xl leading-none text-gold-dark sm:text-5xl">and</p>

              <div className="text-center md:text-right">
                <p className="font-script text-5xl leading-none text-linen sm:text-6xl">{WEDDING.couple.groom.firstName}</p>
                <p className="mt-2 font-josefin text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-linen/92">
                  {WEDDING.couple.groom.fullName}
                </p>
                <div className="mt-3 space-y-1.5 font-cormorant text-base italic text-linen/95 sm:text-[1.05rem]">
                  {FAMILY.groom.map((line) => (
                    <p key={`${line.role}-${line.name}`}>
                      <span className="font-josefin text-[0.64rem] font-semibold uppercase tracking-[0.15em] text-linen/88">{line.role}</span>{" "}
                      {line.name} {line.relation}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-dashed border-linen/45 pt-5 text-center">
              <p className="cinzel-title text-[0.68rem] text-linen/90">SUMUHURTHAM</p>
              <p className="mt-2 font-script text-[2rem] leading-none text-linen sm:text-[2.2rem]">September 5, 2026</p>
              <p className="font-script-alt text-[1.65rem] leading-none text-gold-dark sm:text-[1.85rem]">9:31 PM</p>
            </div>

            <p className="mt-6 text-center font-josefin text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-linen/92">
              {WEDDING.hashtag}
            </p>
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
        <p className="font-josefin text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-linen/92">
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
              className="action-button action-button--primary"
            >
              <CalendarPlus className="h-4 w-4" />
              Google Calendar
            </a>
          ) : (
            <button
              type="button"
              onClick={() => addGoogleCalendarInvite(events, {
                filename: "manas-rupa-full-celebration-google.ics",
                calendarName: "Manas & Rupa Sree Full Celebration",
              })}
              className="action-button action-button--primary"
            >
              <CalendarPlus className="h-4 w-4" />
              Google Calendar
            </button>
          )}
          <button
            type="button"
            onClick={() => downloadCalendarInvite(events, {
              filename: invitation.showAllEvents ? "manas-rupa-full-celebration.ics" : "manas-rupa-wedding.ics",
              calendarName: invitation.showAllEvents ? "Manas & Rupa Sree Full Celebration" : "Manas & Rupa Sree Wedding",
            })}
            className="action-button action-button--ghost"
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
      <section id="wedding-venue" data-analytics-section="Venue Details" className="event-timeline wedding-spotlight">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-josefin text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-linen/92">Wedding Ceremony</p>
            <h2 className="mt-2 font-script text-5xl leading-none text-linen sm:text-6xl">Kalyana Mahotsavam</h2>
            <p className="mx-auto mt-3 max-w-2xl font-cormorant text-xl italic text-linen/94">
              Sumuhurtham, venue, meal, and attire details for the marriage ceremony.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="wedding-spotlight-card">
            <article
              className="timeline-event timeline-event--has-image wedding-ceremony-card"
            >
              <div className="timeline-event__text">
                <p className="timeline-event__time">{WEDDING_EVENT.time}</p>
                <p className="timeline-event__name">{WEDDING_EVENT.name}</p>
                <p className="timeline-event__venue">{WEDDING_EVENT.dateLabel} · {WEDDING_EVENT.venue}</p>
                <a
                  href={WEDDING_EVENT.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-event__address"
                  onClick={(event) => event.stopPropagation()}
                >
                  <MapPin className="h-4 w-4" />
                  <span>{WEDDING_EVENT.address}</span>
                </a>
                <div className="wedding-detail-chips" aria-label="Wedding ceremony details">
                  <span><Clock className="h-3.5 w-3.5" /> 9:31 PM</span>
                  <span><Utensils className="h-3.5 w-3.5" /> {WEDDING_EVENT.meal}</span>
                  <span><Shirt className="h-3.5 w-3.5" /> {WEDDING_EVENT.dressCode}</span>
                </div>
              </div>
              {WEDDING_EVENT.image ? (
                <img src={WEDDING_EVENT.image} alt={WEDDING_EVENT.name} className="timeline-event__thumb" />
              ) : null}
            </article>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}

function CouplePhoto() {
  return (
    <>
      <KolamDivider />
      <section className="py-6 text-center">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-linen/45 bg-gradient-to-br from-[#7c4832] via-[#522324] to-[#273318] p-2.5 px-4 shadow-[0_22px_52px_rgba(0,0,0,0.3)] sm:px-6">
            <div className="overflow-hidden rounded-xl border border-linen/18">
              <img
                src="/couple-mr.jpg"
                alt="Manas and Rupa Sree"
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
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
      "Invitation Preview",
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

      <Hero invitationMode={invitationMode} />
      <section id="countdown" data-analytics-section="Countdown" className="section-tight text-center">
        <ScrollReveal>
          <p className="font-josefin text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-linen/92">
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
          <CouplePhoto />
        </>
      ) : (
        <>
          <WeddingOnlyDetails />
          <KolamDivider />
          <InvitationPreview />
          <CouplePhoto />
        </>
      )}

      <CalendarActions invitationMode={invitationMode} />
      <section className="section-tight pt-0 text-center">
        <Link
          href={invitation.rsvpPath}
          className="action-button action-button--primary"
        >
          RSVP Now
        </Link>
      </section>
    </div>
  );
}
