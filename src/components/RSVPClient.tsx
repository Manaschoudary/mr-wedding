"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { EVENTS } from "@/lib/data";
import { KolamDivider } from "@/components/KolamDivider";
import { ScrollReveal } from "@/components/ScrollReveal";

type AttendanceStatus = "attending" | "tentative" | "decline" | "";

interface EventRSVP {
  eventId: string;
  status: AttendanceStatus;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: "attending", label: "Attending" },
  { value: "tentative", label: "Tentative" },
  { value: "decline", label: "Decline" },
];

export function RSVPClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventResponses, setEventResponses] = useState<EventRSVP[]>(
    EVENTS.map((e) => ({ eventId: e.id, status: "" }))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function updateEventStatus(eventId: string, status: AttendanceStatus) {
    setEventResponses((prev) =>
      prev.map((r) => (r.eventId === eventId ? { ...r, status } : r))
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    const hasResponse = eventResponses.some((r) => r.status !== "");
    if (!hasResponse) {
      setError("Please respond to at least one event.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          events: eventResponses.filter((r) => r.status !== ""),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-20">
        <KolamDivider />
        <section className="section-padding text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-gold/40 flex items-center justify-center">
              <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-gold mb-4">Thank You!</h2>
            <p className="text-text-secondary">
              Your RSVP has been received. We look forward to celebrating with you!
            </p>
          </motion.div>
        </section>
        <KolamDivider />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <KolamDivider />

      <section className="section-padding text-center max-w-2xl mx-auto">
        <ScrollReveal>
          <p className="text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            Kindly Respond
          </p>
          <h2 className="font-serif text-4xl text-gold mb-3">RSVP</h2>
          <p className="text-text-secondary text-sm mb-10">
            We look forward to celebrating with you
          </p>
        </ScrollReveal>

        <form onSubmit={handleSubmit} className="text-left space-y-8">
          {/* Guest Info */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-text-muted text-xs tracking-widest uppercase mb-2">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-secondary/60 border border-gold/15 rounded-lg px-4 py-3 text-cream text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-gold/40 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-text-muted text-xs tracking-widest uppercase mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-secondary/60 border border-gold/15 rounded-lg px-4 py-3 text-cream text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-text-muted text-xs tracking-widest uppercase mb-2">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-bg-secondary/60 border border-gold/15 rounded-lg px-4 py-3 text-cream text-sm placeholder:text-text-muted/50 focus:outline-none focus:border-gold/40 transition-colors"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Per-Event RSVP */}
          <div className="space-y-6">
            {EVENTS.map((event, i) => {
              const response = eventResponses.find((r) => r.eventId === event.id);
              return (
                <ScrollReveal key={event.id} delay={0.15 + i * 0.05}>
                  <div className="bg-bg-secondary/40 rounded-xl p-5 border border-gold/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg text-cream">
                          {event.name}
                        </h3>
                        <p className="text-text-muted text-xs mt-1">
                          {event.date} · {event.time}
                        </p>
                      </div>
                      <div className="flex gap-2 rsvp-option">
                        {STATUS_OPTIONS.map((opt) => (
                          <span key={opt.value}>
                            <input
                              type="radio"
                              id={`${event.id}-${opt.value}`}
                              name={event.id}
                              value={opt.value}
                              checked={response?.status === opt.value}
                              onChange={() => updateEventStatus(event.id, opt.value)}
                            />
                            <label htmlFor={`${event.id}-${opt.value}`}>
                              {opt.label}
                            </label>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-burgundy-light text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <ScrollReveal delay={0.3}>
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="inline-block px-12 py-3 border border-gold text-gold text-sm tracking-widest uppercase rounded-full hover:bg-gold hover:text-bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send RSVP"}
              </button>
            </div>
          </ScrollReveal>
        </form>
      </section>

      <KolamDivider />
    </div>
  );
}
