"use client";

import { useMemo, useState, type ComponentProps } from "react";
import { motion } from "framer-motion";
import { EVENTS, type AttendanceStatus } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";

interface EventResponse {
  readonly eventId: string;
  readonly status: AttendanceStatus;
}

const STATUS_OPTIONS: readonly AttendanceStatus[] = ["attending", "tentative", "decline"];

function createInitialResponses(): readonly EventResponse[] {
  return EVENTS.map((event) => ({ eventId: event.id, status: "tentative" }));
}

export function RSVPClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [responses, setResponses] = useState<readonly EventResponse[]>(createInitialResponses);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const byId = useMemo(() => new Map(responses.map((entry) => [entry.eventId, entry.status])), [responses]);

  function updateStatus(eventId: string, status: AttendanceStatus) {
    setResponses((current) => current.map((entry) => (entry.eventId === eventId ? { ...entry, status } : entry)));
  }

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (event) => {
    event.preventDefault();
    setError("");

    if (name.trim().length === 0) {
      setError("Please enter your name.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().length > 0 ? email.trim() : undefined,
        phone: phone.trim().length > 0 ? phone.trim() : undefined,
        note: note.trim().length > 0 ? note.trim() : undefined,
        events: responses,
      };

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { readonly error?: string };
        throw new Error(data.error ?? "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pb-10 pt-24">
        <KolamDivider />
        <section className="section-tight text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-script text-6xl leading-none text-linen">Thank You</p>
            <p className="mt-4 font-josefin text-[0.76rem] uppercase tracking-[0.24em] text-linen/84">
              Your RSVP has been received
            </p>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-10 pt-24">
      <KolamDivider />
      <section className="section-tight max-w-4xl">
        <div className="text-center">
          <p className="font-josefin text-[0.68rem] uppercase tracking-[0.34em] text-linen/86">KINDLY RESPOND</p>
          <p className="mt-2 font-script text-7xl leading-none text-linen">RSVP</p>
          <p className="mx-auto mt-3 flex items-center justify-center gap-3 text-linen/80" aria-hidden>
            <span className="h-px w-10 bg-linen/45" />
            <span>♡</span>
            <span className="h-px w-10 bg-linen/45" />
          </p>
          <p className="mt-3 font-josefin text-[0.7rem] uppercase tracking-[0.28em] text-linen/84">
            WE LOOK FORWARD TO CELEBRATING WITH YOU
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <input className="rsvp-input" placeholder="Your Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rsvp-input" placeholder="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input
              className="rsvp-input"
              placeholder="Phone (optional)"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <div className="space-y-4">
            {EVENTS.map((eventItem) => (
              <article key={eventItem.id} className="rounded-2xl border border-linen/40 bg-linen-soft p-5 text-ink">
                <p className="font-script text-[2.1rem] leading-none">{eventItem.name}</p>
                <p className="mt-2 font-josefin text-[0.66rem] uppercase tracking-[0.22em]">{eventItem.date}</p>
                <p className="mt-1 font-cormorant text-xl italic">{eventItem.time}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {STATUS_OPTIONS.map((statusValue, index) => {
                    const active = byId.get(eventItem.id) === statusValue;
                    const mobileLayoutClass =
                      index < 2
                        ? "basis-[calc(50%-0.25rem)] grow sm:basis-auto sm:grow-0"
                        : "basis-full sm:basis-auto";
                    return (
                      <button
                        key={statusValue}
                        type="button"
                        data-active={active}
                        className={`rsvp-pill min-w-[8.75rem] text-center ${mobileLayoutClass}`}
                        onClick={() => updateStatus(eventItem.id, statusValue)}
                      >
                        {statusValue}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>

          <textarea
            className="rsvp-input min-h-28"
            placeholder="A note for the couple (optional)"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />

          {error.length > 0 ? <p className="text-center font-josefin text-sm text-[#f4bbb1]">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-olive px-6 py-3 font-josefin text-[0.72rem] uppercase tracking-[0.26em] text-linen transition hover:bg-olive-strong disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "SENDING..." : "SEND RSVP"}
          </button>
        </form>
      </section>
    </div>
  );
}
