"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Calendar, CalendarPlus, Check, ChevronRight, Mail, MessageSquare, Phone, Users } from "lucide-react";
import { addGoogleCalendarInvite, downloadCalendarInvite, getGoogleCalendarUrl } from "@/lib/calendar";
import {
  getInvitationConfig,
  type InvitationMode,
  type WeddingEvent,
  WEDDING_EVENT_ID,
} from "@/lib/data";
import { createQueueId, flushLocalRsvps, hasStoredLocalRsvp, saveLocalRsvp } from "@/lib/offlineOutbox";
import { useVisitAnalytics } from "@/lib/analytics";

type AttendanceValue = "" | "yes" | "no";
type EventResponseMap = Record<string, AttendanceValue>;

interface AdditionalGuest {
  readonly firstName: string;
  readonly lastName: string;
  readonly eventResponses: EventResponseMap;
}

interface RSVPClientProps {
  readonly invitationMode: InvitationMode;
}

function StepDot({ step, current, label }: { readonly step: number; readonly current: number; readonly label: string }) {
  const done = step < current;
  const active = step === current;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-josefin text-xs font-bold transition-all ${
        done
          ? "bg-olive text-linen"
          : active
            ? "border-2 border-olive bg-linen-soft text-olive"
            : "bg-linen/25 text-linen/55"
      }`}>
        {done ? <Check className="h-4 w-4" /> : step}
      </div>
      <span className={`hidden font-josefin text-xs sm:block ${active ? "text-linen" : "text-linen/45"}`}>
        {label}
      </span>
    </div>
  );
}

function StepLine({ done }: { readonly done: boolean }) {
  return <div className={`mb-5 h-0.5 flex-1 transition-all duration-500 ${done ? "bg-olive" : "bg-linen/25"}`} />;
}

function AttendOption({
  value,
  label,
  sub,
  selected,
  onClick,
}: {
  readonly value: "yes" | "no";
  readonly label: string;
  readonly sub: string;
  readonly selected: boolean;
  readonly onClick: (value: "yes" | "no") => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex w-full gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-olive bg-[#eef1e4] shadow-[0_10px_22px_rgba(0,0,0,0.12)]"
          : "border-ink/12 bg-linen-soft hover:border-olive/55"
      }`}
    >
      <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
        selected ? "border-olive bg-olive" : "border-ink/25"
      }`}>
        {selected ? <span className="h-2 w-2 rounded-full bg-linen" /> : null}
      </span>
      <span>
        <span className="block font-josefin text-sm font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block font-josefin text-xs text-ink/58">{sub}</span>
      </span>
    </button>
  );
}

function createEventResponseMap(events: readonly WeddingEvent[]): EventResponseMap {
  return Object.fromEntries(events.map((event) => [event.id, ""])) as EventResponseMap;
}

function blankGuest(events: readonly WeddingEvent[]): AdditionalGuest {
  return {
    firstName: "",
    lastName: "",
    eventResponses: createEventResponseMap(events),
  };
}

function postRsvp(payload: Record<string, unknown>) {
  return fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(async (response) => {
    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error || `RSVP save failed with HTTP ${response.status}`);
    }
    return response.json().catch(() => ({})) as Promise<Record<string, unknown>>;
  });
}

export function RSVPClient({ invitationMode }: RSVPClientProps) {
  const invitation = getInvitationConfig(invitationMode);
  const stepLabels = invitation.showAllEvents
    ? ["Your Info", "Events", "Submit"]
    : ["Your Info", "Submit"];
  const submitStep = invitation.showAllEvents ? 3 : 2;
  const { trackAction, handleTrackedClick } = useVisitAnalytics({
    sections: ["RSVP Header", "RSVP Form"],
    metadata: {
      invitationMode: invitation.mode,
      invitationLabel: invitation.label,
      inviteHomePath: invitation.homePath,
    },
  });
  const startedRef = useRef(false);
  const formStartRef = useRef<HTMLDivElement>(null);
  const additionalGuestsRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [attending, setAttending] = useState<AttendanceValue>("");
  const [additionalNum, setAdditionalNum] = useState(0);
  const [additionals, setAdditionals] = useState<readonly AdditionalGuest[]>([]);
  const [eventResponses, setEventResponses] = useState<EventResponseMap>(() => createEventResponseMap(invitation.additionalEvents));
  const [showGuestConfirm, setShowGuestConfirm] = useState(false);
  const [confirmedSolo, setConfirmedSolo] = useState(false);
  const [contact, setContact] = useState({ phone: "", email: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionStorage, setSubmissionStorage] = useState("");
  const [localSubmissionId, setLocalSubmissionId] = useState("");
  const [error, setError] = useState("");

  const trackRsvpStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    trackAction("rsvp_started", "Started RSVP form");
  };

  const normalizeGuestEventResponses = (guest: Partial<AdditionalGuest> = {}): AdditionalGuest => ({
    firstName: guest.firstName || "",
    lastName: guest.lastName || "",
    eventResponses: {
      ...createEventResponseMap(invitation.events),
      ...(guest.eventResponses || {}),
    },
  });

  const handleAdditionalNumChange = (next: number) => {
    trackRsvpStarted();
    const num = Math.max(0, Math.min(8, next));
    setConfirmedSolo(false);
    setAdditionalNum(num);
    setAdditionals((current) => (
      Array.from({ length: num }, (_, index) => normalizeGuestEventResponses(current[index] || blankGuest(invitation.events)))
    ));
  };

  const handleWeddingAttendanceChange = (value: "yes" | "no") => {
    trackRsvpStarted();
    setAttending(value);
    setConfirmedSolo(false);
    if (value === "no" && !invitation.showAllEvents) {
      setAdditionalNum(0);
      setAdditionals([]);
    }
  };

  const updateAdditional = (index: number, field: "firstName" | "lastName", value: string) => {
    trackRsvpStarted();
    setAdditionals((current) => current.map((guest, currentIndex) => (
      currentIndex === index ? { ...guest, [field]: value } : guest
    )));
  };

  const getGuestEventResponse = (guest: AdditionalGuest, eventId: string): AttendanceValue => (
    guest.eventResponses[eventId] || ""
  );

  const updateGuestEventResponse = (guestIndex: number, eventId: string, value: "yes" | "no") => {
    trackRsvpStarted();
    setAdditionals((current) => current.map((guest, index) => {
      if (index !== guestIndex) return guest;
      const normalized = normalizeGuestEventResponses(guest);
      return {
        ...normalized,
        eventResponses: {
          ...normalized.eventResponses,
          [eventId]: value,
        },
      };
    }));
  };

  const additionalGuestsValid = () => (
    additionalNum === 0 || additionals.every((guest) => guest.firstName.trim())
  );

  const additionalGuestSectionActive = () => invitation.showAllEvents || attending === "yes";

  const step1Valid = () => Boolean(
    firstName.trim() &&
    lastName.trim() &&
    attending !== "" &&
    (!additionalGuestSectionActive() || additionalGuestsValid())
  );

  const getEventResponse = (eventId: string): AttendanceValue => (
    eventId === WEDDING_EVENT_ID ? attending : eventResponses[eventId]
  );

  const updateEventResponse = (eventId: string, value: "yes" | "no") => {
    trackRsvpStarted();
    if (eventId === WEDDING_EVENT_ID) {
      handleWeddingAttendanceChange(value);
      return;
    }
    setEventResponses((current) => ({ ...current, [eventId]: value }));
  };

  const confirmedAdditionalGuests = () => additionals.filter((guest) => guest.firstName.trim());

  const eventResponsesValid = () => (
    !invitation.showAllEvents ||
    invitation.events.every((event) => (
      ["yes", "no"].includes(getEventResponse(event.id)) &&
      confirmedAdditionalGuests().every((guest) => ["yes", "no"].includes(getGuestEventResponse(guest, event.id)))
    ))
  );

  const eventAttendancePayload = () => {
    const additionalGuests = confirmedAdditionalGuests();
    return invitation.events.map((event) => {
      const response = getEventResponse(event.id);
      const guestResponses = additionalGuests.map((guest) => {
        const guestResponse = invitation.showAllEvents
          ? getGuestEventResponse(guest, event.id)
          : response;

        return {
          firstName: guest.firstName.trim(),
          lastName: guest.lastName.trim(),
          name: `${guest.firstName} ${guest.lastName}`.trim(),
          attending: guestResponse,
        };
      });
      const guestCount = (response === "yes" ? 1 : 0) +
        guestResponses.filter((guest) => guest.attending === "yes").length;

      return {
        id: event.id,
        name: event.name,
        dateLabel: event.dateLabel,
        timeLabel: event.timeLabel,
        venue: event.venue,
        attending: response,
        primaryGuest: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          name: `${firstName} ${lastName}`.trim(),
          attending: response,
        },
        guestResponses,
        guestCount,
      };
    });
  };

  const scrollToFormStart = () => {
    requestAnimationFrame(() => {
      formStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const completeStepOne = () => {
    trackAction("rsvp_step_completed", "Completed RSVP step 1", {
      attending,
      additionalGuests: additionalNum,
      invitationMode: invitation.mode,
    });
    setStep(invitation.showAllEvents ? 2 : submitStep);
    scrollToFormStart();
  };

  const handleContinue = () => {
    if (!invitation.showAllEvents && attending === "yes" && additionalNum === 0 && !confirmedSolo) {
      trackAction("rsvp_guest_confirmation_shown", "Asked to confirm no additional guests");
      setShowGuestConfirm(true);
      return;
    }

    completeStepOne();
  };

  const confirmSoloAttendance = () => {
    setConfirmedSolo(true);
    setShowGuestConfirm(false);
    trackAction("rsvp_solo_confirmed", "Confirmed attending without additional guests");
    completeStepOne();
  };

  const addGuestFromConfirmation = () => {
    setShowGuestConfirm(false);
    handleAdditionalNumChange(1);
    trackAction("rsvp_add_guests_prompt", "Chose to add guests from confirmation");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        additionalGuestsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        additionalGuestsRef.current?.querySelector("input")?.focus();
      });
    });
  };

  const completeEventStep = () => {
    if (!eventResponsesValid()) return;
    trackAction("rsvp_step_completed", "Completed event RSVP step", {
      invitationMode: invitation.mode,
      events: eventAttendancePayload().map((event) => ({
        id: event.id,
        attending: event.attending,
        guestCount: event.guestCount,
      })),
    });
    setStep(submitStep);
    scrollToFormStart();
  };

  useEffect(() => {
    if (!submitted || !["local", "email_fallback"].includes(submissionStorage) || !localSubmissionId) return undefined;

    const markSyncedIfNeeded = (syncedRsvps: readonly Record<string, unknown>[] = []) => {
      const synced = syncedRsvps.some((rsvp) => rsvp.clientSubmissionId === localSubmissionId);

      if (synced || !hasStoredLocalRsvp(localSubmissionId)) {
        setSubmissionStorage("server");
        setLocalSubmissionId("");
      }
    };
    const trySync = () => {
      flushLocalRsvps()
        .then((result) => {
          const emailed = result.emailBackedUp?.some((rsvp) => rsvp.clientSubmissionId === localSubmissionId);
          if (emailed) setSubmissionStorage("email_fallback");
          markSyncedIfNeeded(result.synced || []);
        })
        .catch(() => {});
    };

    trySync();
    window.addEventListener("online", trySync);
    const interval = window.setInterval(trySync, 15000);

    return () => {
      window.removeEventListener("online", trySync);
      window.clearInterval(interval);
    };
  }, [submitted, submissionStorage, localSubmissionId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    const additionalGuests = confirmedAdditionalGuests().map((guest) => ({
      firstName: guest.firstName.trim(),
      lastName: guest.lastName.trim(),
      eventResponses: guest.eventResponses,
    }));
    const eventAttendance = eventAttendancePayload();
    const payload = {
      invitationMode: invitation.mode,
      invitationLabel: invitation.label,
      invitedEvents: invitation.events.map((event) => ({
        id: event.id,
        name: event.name,
        dateLabel: event.dateLabel,
        venue: event.venue,
      })),
      eventAttendance,
      primaryGuest: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        attending,
        ...contact,
      },
      additionalGuests,
      clientSubmissionId: createQueueId("rsvp"),
      submittedAt: new Date().toISOString(),
    };

    try {
      const responseData = await postRsvp(payload);
      if (responseData.storage === "email_fallback") {
        const localRsvp = saveLocalRsvp(
          { ...payload, emailFallbackSent: true },
          new Error(String(responseData.warning || "Database save failed after email backup"))
        );
        setSubmissionStorage("email_fallback");
        setLocalSubmissionId(String(localRsvp.clientSubmissionId || ""));
      } else {
        setSubmissionStorage("server");
      }

      trackAction("rsvp_submitted", "Submitted RSVP", {
        attending,
        invitationMode: invitation.mode,
        additionalGuests: additionalGuests.length,
        events: eventAttendance.map((event) => ({
          id: event.id,
          attending: event.attending,
          guestCount: event.guestCount,
        })),
        storage: responseData.storage || "server",
      });
      setSubmitted(true);
    } catch (caught) {
      const localRsvp = saveLocalRsvp(payload, caught);
      trackAction("rsvp_saved_local", "RSVP saved locally after server save failed", {
        attending,
        invitationMode: invitation.mode,
        error: localRsvp.serverError,
      });
      trackAction("rsvp_submitted", "Submitted RSVP", {
        attending,
        invitationMode: invitation.mode,
        additionalGuests: additionalGuests.length,
        events: eventAttendance.map((event) => ({
          id: event.id,
          attending: event.attending,
          guestCount: event.guestCount,
        })),
        storage: "local",
      });
      setSubmissionStorage("local");
      setLocalSubmissionId(String(localRsvp.clientSubmissionId || ""));
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const attendanceSummary = eventAttendancePayload();
  const attendingCalendarEvents = invitation.events.filter((event) => (
    attendanceSummary.some((response) => response.id === event.id && response.guestCount > 0)
  ));
  const hasAnyAttendance = attendingCalendarEvents.length > 0;
  const trackCalendarAction = (provider: string, events: readonly WeddingEvent[], scope = "attending_events") => {
    trackAction("calendar_invite_added", `${provider} calendar invite`, {
      provider,
      scope,
      eventCount: events.length,
      eventIds: events.map((event) => event.id),
      invitationMode: invitation.mode,
      source: "rsvp_success",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen pb-16 pt-28" onClickCapture={handleTrackedClick}>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <div className="rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-7 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-olive/15">
              <Check className="h-10 w-10 text-olive" />
            </div>
            <h1 className="font-cormorant text-4xl italic text-ink">
              {hasAnyAttendance ? "RSVP received!" : "Thank you!"}
            </h1>
            <p className="mt-3 font-josefin text-sm text-ink/70">
              {hasAnyAttendance
                ? `Thank you, ${firstName}. We have your event responses.`
                : `Thank you for letting us know, ${firstName}. You'll be missed!`}
            </p>
            {submissionStorage === "local" ? (
              <p className="mt-4 rounded-lg border border-gold-dark/35 bg-[#fbf2de] px-3 py-2 font-josefin text-xs text-ink/75">
                Your RSVP is saved on this device and will retry syncing when the server is reachable.
              </p>
            ) : null}
            {hasAnyAttendance ? (
              <>
                <p className="mt-5 font-josefin text-xs uppercase tracking-[0.22em] text-ink/55">
                  {invitation.showAllEvents
                    ? `${attendingCalendarEvents.length} event${attendingCalendarEvents.length === 1 ? "" : "s"} marked attending`
                    : "September 5, 2026 · 9:31 PM · Atithi Venue"}
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  {invitation.showAllEvents ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          trackCalendarAction("google", attendingCalendarEvents);
                          addGoogleCalendarInvite(attendingCalendarEvents, {
                            filename: "manas-rupa-my-rsvp-events-google.ics",
                            calendarName: "Manas & Rupa Sree - My RSVP Events",
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-xs uppercase tracking-[0.18em] text-linen"
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Google Calendar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          trackCalendarAction("apple_outlook", attendingCalendarEvents);
                          downloadCalendarInvite(attendingCalendarEvents, {
                            filename: "manas-rupa-my-rsvp-events.ics",
                            calendarName: "Manas & Rupa Sree - My RSVP Events",
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 px-5 py-3 font-josefin text-xs uppercase tracking-[0.18em] text-ink"
                      >
                        <Calendar className="h-4 w-4" />
                        Apple / Outlook
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={getGoogleCalendarUrl(invitation.events[0])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-xs uppercase tracking-[0.18em] text-linen"
                        onClick={() => trackCalendarAction("google", [invitation.events[0]], "wedding_event")}
                      >
                        <CalendarPlus className="h-4 w-4" />
                        Google Calendar
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          trackCalendarAction("apple_outlook", [invitation.events[0]], "wedding_event");
                          downloadCalendarInvite(invitation.events[0]);
                        }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 px-5 py-3 font-josefin text-xs uppercase tracking-[0.18em] text-ink"
                      >
                        <Calendar className="h-4 w-4" />
                        Apple / Outlook
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pt-28" onClickCapture={handleTrackedClick}>
      {showGuestConfirm ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guest-confirm-title"
          aria-describedby="guest-confirm-description"
        >
          <div className="w-full max-w-sm rounded-2xl border border-linen/40 bg-linen-soft p-6 text-center text-ink shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-olive/15">
              <Users className="h-7 w-7 text-olive" />
            </div>
            <h2 id="guest-confirm-title" className="font-cormorant text-2xl italic text-ink">
              No additional guests?
            </h2>
            <p id="guest-confirm-description" className="mb-6 mt-2 font-josefin text-sm text-ink/60">
              Submit RSVP on the next screen.
            </p>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={addGuestFromConfirmation} className="rounded-xl bg-olive px-5 py-3 font-josefin text-xs uppercase tracking-[0.2em] text-linen" autoFocus>
                Add Guests
              </button>
              <button type="button" onClick={confirmSoloAttendance} className="rounded-xl border border-ink/20 px-5 py-3 font-josefin text-xs uppercase tracking-[0.2em] text-ink">
                Continue Without Guests
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section data-analytics-section="RSVP Header" className="section-tight pb-7 text-center">
        <p className="font-josefin text-[0.68rem] uppercase tracking-[0.34em] text-linen/86">
          {invitation.showAllEvents ? "Wedding Celebrations" : "Marriage Ceremony"} · September 5, 2026
        </p>
        <h1 className="mt-2 font-script text-7xl leading-none text-linen">RSVP</h1>
        <p className="mx-auto mt-3 max-w-xl font-cormorant text-xl italic text-linen/86">
          {invitation.showAllEvents
            ? "Let us know which events you can attend, and add any family members joining you."
            : "Let us know if you can celebrate with us, and add any family members joining you."}
        </p>
      </section>

      <div ref={formStartRef} className={`${stepLabels.length === 3 ? "max-w-md" : "max-w-xs"} relative z-10 mx-auto mb-8 px-6`}>
        <div className="flex items-center">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            return (
              <Fragment key={label}>
                <StepDot step={stepNumber} current={step} label={label} />
                {index < stepLabels.length - 1 ? <StepLine done={step > stepNumber} /> : null}
              </Fragment>
            );
          })}
        </div>
      </div>

      {step === 1 ? (
        <div data-analytics-section="RSVP Form" className="mx-auto max-w-lg px-4 pb-20">
          <div className="rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-5 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:p-7">
            <p className="text-center font-josefin text-[0.66rem] uppercase tracking-[0.28em] text-ink/55">Step one</p>
            <h2 className="mb-2 text-center font-cormorant text-3xl italic text-ink">Your Details</h2>
            <p className="mb-6 text-center font-josefin text-sm text-ink/58">Please enter your first and last name below.</p>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">First Name *</label>
                <input className="form-input" value={firstName} onChange={(event) => { trackRsvpStarted(); setFirstName(event.target.value); }} placeholder="First name" />
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input className="form-input" value={lastName} onChange={(event) => { trackRsvpStarted(); setLastName(event.target.value); }} placeholder="Last name" />
              </div>
            </div>

            <div className="mb-6">
              <label className="form-label mb-3 block">
                Will you attend the wedding ceremony? *
              </label>
              <div className="space-y-3">
                <AttendOption
                  value="yes"
                  label="Joyfully accepts"
                  sub="I'll be there for the marriage ceremony."
                  selected={attending === "yes"}
                  onClick={handleWeddingAttendanceChange}
                />
                <AttendOption
                  value="no"
                  label="Regretfully declines"
                  sub="I'm unable to make the marriage ceremony."
                  selected={attending === "no"}
                  onClick={handleWeddingAttendanceChange}
                />
              </div>
            </div>

            {additionalGuestSectionActive() ? (
              <div ref={additionalGuestsRef} className="mb-6 rounded-xl border border-ink/10 bg-[#fffaf4] p-4 shadow-sm">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-olive/15">
                    <Users className="h-5 w-5 text-olive" />
                  </div>
                  <div className="text-left">
                    <p className="font-josefin text-sm font-semibold text-ink">
                      {invitation.showAllEvents ? "Are any guests included in this invitation?" : "Is anyone accompanying you?"}
                    </p>
                    <p className="mt-1 font-josefin text-xs text-ink/58">
                      {invitation.showAllEvents
                        ? "Add each guest here. On the next step, choose which events each person can attend."
                        : "Add your spouse, children, family members, or other accompanying guests."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => handleAdditionalNumChange(additionalNum - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-xl text-ink transition hover:border-olive">-</button>
                  <span className="w-8 text-center font-cormorant text-3xl italic text-olive">{additionalNum}</span>
                  <button type="button" onClick={() => handleAdditionalNumChange(additionalNum + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-xl text-ink transition hover:border-olive">+</button>
                </div>
                <p className="mt-3 font-josefin text-xs text-ink/48">
                  {additionalNum === 0 ? "Currently: Just Me" : `${additionalNum} additional guest${additionalNum === 1 ? "" : "s"}`}
                </p>

                {additionals.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {additionals.map((guest, index) => (
                      <div key={index} className="rounded-lg border border-ink/10 p-3">
                        <p className="mb-3 flex items-center gap-1.5 font-josefin text-xs font-semibold text-ink/62">
                          <Users className="h-3.5 w-3.5" />
                          Guest {index + 1}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="min-w-0">
                            <label className="form-label whitespace-nowrap">First Name *</label>
                            <input className="form-input text-sm" placeholder="First name" value={guest.firstName} onChange={(event) => updateAdditional(index, "firstName", event.target.value)} aria-invalid={!guest.firstName.trim()} />
                          </div>
                          <div className="min-w-0">
                            <label className="form-label whitespace-nowrap">Last Name</label>
                            <input className="form-input text-sm" placeholder="Last name" value={guest.lastName} onChange={(event) => updateAdditional(index, "lastName", event.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                    {!additionalGuestsValid() ? (
                      <p className="font-josefin text-xs text-[#a14232]">Enter a first name for each additional guest to continue.</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!step1Valid()}
              onClick={handleContinue}
              className={`flex w-full items-center justify-center gap-2 rounded-xl bg-olive px-5 py-3 font-josefin text-xs uppercase tracking-[0.22em] text-linen transition hover:bg-olive-strong ${!step1Valid() ? "cursor-not-allowed opacity-40" : ""}`}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {invitation.showAllEvents && step === 2 ? (
        <div data-analytics-section="RSVP Form" className="mx-auto max-w-2xl px-4 pb-20">
          <div className="rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-5 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:p-7">
            <p className="text-center font-josefin text-[0.66rem] uppercase tracking-[0.28em] text-ink/55">Step two</p>
            <h2 className="mb-2 text-center font-cormorant text-3xl italic text-ink">Event RSVP</h2>
            <p className="mb-6 text-center font-josefin text-sm text-ink/58">Please respond for each invited event individually.</p>

            <div className="space-y-4">
              {invitation.events.map((event) => {
                const response = getEventResponse(event.id);
                const guestRows = confirmedAdditionalGuests();

                return (
                  <article key={event.id} className="rounded-xl border border-ink/10 bg-[#fffaf4] p-4">
                    <div className="mb-4">
                      <p className="font-josefin text-[0.58rem] uppercase tracking-[0.22em] text-ink/48">{event.category}</p>
                      <h3 className="font-cormorant text-2xl italic text-ink">{event.name}</h3>
                      <p className="font-josefin text-xs text-ink/62">{event.dateLabel}</p>
                      <p className="font-josefin text-xs text-ink/62">{event.timeLabel} · {event.venue}</p>
                    </div>
                    <div className="space-y-3" aria-label={`${event.name} RSVP`}>
                      <AttendeeEventRow
                        label="Primary guest"
                        name={`${firstName} ${lastName}`}
                        response={response}
                        onSelect={(value) => updateEventResponse(event.id, value)}
                      />

                      {guestRows.map((guest, guestIndex) => (
                        <AttendeeEventRow
                          key={`${event.id}-${guestIndex}`}
                          label={`Guest ${guestIndex + 1}`}
                          name={`${guest.firstName} ${guest.lastName}`}
                          response={getGuestEventResponse(guest, event.id)}
                          onSelect={(value) => updateGuestEventResponse(guestIndex, event.id, value)}
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            {!eventResponsesValid() ? (
              <p className="mt-4 text-center font-josefin text-xs text-[#a14232]">Please choose attending or not attending for each event.</p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={completeEventStep}
                disabled={!eventResponsesValid()}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-olive px-5 py-4 font-josefin text-xs uppercase tracking-[0.22em] text-linen ${!eventResponsesValid() ? "cursor-not-allowed opacity-40" : ""}`}
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-xl border border-ink/18 px-5 py-4 font-josefin text-xs uppercase tracking-[0.22em] text-ink">
                Back
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {step === submitStep ? (
        <div data-analytics-section="RSVP Form" className="mx-auto max-w-lg px-4 pb-20">
          <div className="rounded-2xl border border-dashed border-linen/45 bg-linen-soft p-5 text-ink shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:p-7">
            <p className="text-center font-josefin text-[0.66rem] uppercase tracking-[0.28em] text-ink/55">
              {invitation.showAllEvents ? "Step three" : "Step two"}
            </p>
            <h2 className="mb-2 text-center font-cormorant text-3xl italic text-ink">Submit RSVP</h2>

            <div className="mb-6 rounded-xl border border-ink bg-ink p-3 text-center shadow-sm">
              <p className="font-josefin text-sm font-bold text-linen">Not submitted yet</p>
              <p className="mt-1 font-josefin text-xs font-medium text-linen/90">The submission button is at the bottom of this step.</p>
            </div>

            <div className="mb-6 space-y-4">
              <ContactField icon={<Phone className="h-3.5 w-3.5" />} label="Phone (optional)">
                <input type="tel" className="form-input" placeholder="(555) 123-4567" value={contact.phone} onChange={(event) => { trackRsvpStarted(); setContact((current) => ({ ...current, phone: event.target.value })); }} />
              </ContactField>
              <ContactField icon={<Mail className="h-3.5 w-3.5" />} label="Email (optional)">
                <input type="email" className="form-input" placeholder="your@email.com" value={contact.email} onChange={(event) => { trackRsvpStarted(); setContact((current) => ({ ...current, email: event.target.value })); }} />
              </ContactField>
              <ContactField icon={<MessageSquare className="h-3.5 w-3.5" />} label="Message for the couple (optional)">
                <textarea className="form-input min-h-24 resize-none" placeholder="Write a short note..." value={contact.notes} onChange={(event) => { trackRsvpStarted(); setContact((current) => ({ ...current, notes: event.target.value })); }} />
              </ContactField>
            </div>

            <div className="mb-6 space-y-2 rounded-xl border border-ink/10 bg-[#fffaf4] p-4">
              <h3 className="mb-2 font-cormorant text-lg italic text-ink">Your RSVP Summary</h3>
              <p className="font-josefin text-sm text-ink/70">
                <span className="font-semibold">{firstName} {lastName}</span>
                {" - "}
                <span className={attending === "yes" ? "text-olive" : "text-[#a14232]"}>
                  {attending === "yes" ? "Wedding attending" : "Wedding not attending"}
                </span>
              </p>
              {confirmedAdditionalGuests().map((guest, index) => (
                <p key={index} className="font-josefin text-sm text-ink/70">
                  + <span className="font-semibold">{guest.firstName} {guest.lastName}</span>
                </p>
              ))}
              <p className="border-t border-ink/10 pt-2 font-josefin text-xs text-ink/48">
                {1 + confirmedAdditionalGuests().length} guest(s) total
              </p>
              {invitation.showAllEvents ? (
                <div className="space-y-1 pt-1">
                  {eventAttendancePayload().map((event) => (
                    <div key={event.id} className="flex items-center justify-between gap-3 rounded-lg bg-linen-soft px-3 py-2 font-josefin text-xs">
                      <span>{event.name}</span>
                      <strong className={event.guestCount > 0 ? "text-olive" : "text-[#a14232]"}>
                        {event.guestCount} attending
                      </strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {error ? <p className="mb-4 text-center font-josefin text-sm text-[#a14232]">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl bg-olive px-5 py-4 font-josefin text-xs uppercase tracking-[0.22em] text-linen ${submitting ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {submitting ? "Sending..." : <>Submit RSVP <Check className="h-4 w-4" /></>}
              </button>
              <button type="button" onClick={() => setStep(invitation.showAllEvents ? 2 : 1)} className="flex-1 rounded-xl border border-ink/18 px-5 py-4 font-josefin text-xs uppercase tracking-[0.22em] text-ink">
                Back
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AttendeeEventRow({
  label,
  name,
  response,
  onSelect,
}: {
  readonly label: string;
  readonly name: string;
  readonly response: AttendanceValue;
  readonly onSelect: (value: "yes" | "no") => void;
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-ink/10 bg-linen-soft p-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <span className="font-josefin text-[0.6rem] uppercase tracking-[0.2em] text-ink/48">{label}</span>
        <strong className="block font-josefin text-sm text-ink">{name.trim()}</strong>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "yes" as const, label: "Attending" },
          { value: "no" as const, label: "Not attending" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-full border px-3 py-2 font-josefin text-[0.58rem] uppercase tracking-[0.14em] transition ${
              response === option.value
                ? "border-olive bg-olive text-linen"
                : "border-ink/15 text-ink/62 hover:border-olive"
            }`}
            aria-pressed={response === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ContactField({
  icon,
  label,
  children,
}: {
  readonly icon: ReactNode;
  readonly label: string;
  readonly children: ReactNode;
}) {
  return (
    <div>
      <label className="form-label flex items-center gap-2">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
