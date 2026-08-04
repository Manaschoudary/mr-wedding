"use client";

import { useMemo, useState } from "react";
import { EventModal } from "@/components/EventsClient";
import type { WeddingEvent } from "@/lib/data";

interface TimelineProps {
  readonly events: readonly WeddingEvent[];
}

interface TimelineGroup {
  readonly dateLabel: string;
  readonly events: readonly WeddingEvent[];
}

const TIMELINE_ORDER = [
  { key: "Friday, September 4, 2026", label: "Sept 4" },
  { key: "Saturday, September 5, 2026", label: "Sept 5" },
  { key: "Sunday, September 6, 2026", label: "Sept 6" },
] as const;

function getTimelineGroups(events: readonly WeddingEvent[]): readonly TimelineGroup[] {
  const grouped = new Map<string, WeddingEvent[]>();
  for (const event of events) {
    const existing = grouped.get(event.date);
    if (existing) {
      existing.push(event);
      continue;
    }
    grouped.set(event.date, [event]);
  }

  return TIMELINE_ORDER.map(({ key, label }) => {
    const dayEvents = grouped.get(key) ?? [];
    return { dateLabel: label, events: dayEvents };
  }).filter((group) => group.events.length > 0);
}

export function Timeline({ events }: TimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<WeddingEvent | null>(null);
  const groups = useMemo(() => getTimelineGroups(events), [events]);

  return (
    <section className="event-timeline" aria-labelledby="timeline-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-josefin text-[0.68rem] uppercase tracking-[0.3em] text-linen/86">EVENT FLOW</p>
        <h2 id="timeline-title" className="mt-2 font-script text-5xl leading-none text-linen sm:text-6xl">
          Wedding Functions
        </h2>
        <p className="mx-auto mt-3 max-w-2xl font-cormorant text-xl italic text-linen/88">
          Tap any event card to view complete details for ceremony timings, venue, and guidance.
        </p>
      </div>

      <div className="timeline-track mt-10">
        {groups.map((group) => (
          <div key={group.dateLabel} className="timeline-date-group">
            <div className="timeline-date-label">
              <span>{group.dateLabel}</span>
            </div>

            <div className="space-y-4">
              {group.events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="timeline-event timeline-event--has-image"
                  onClick={() => setSelectedEvent(event)}
                  aria-label={`View details for ${event.name}`}
                >
                  <div className="timeline-event__text">
                    <p className="timeline-event__time">{event.time}</p>
                    <p className="timeline-event__name">{event.name}</p>
                    <p className="timeline-event__venue">{event.venue}</p>
                    <a
                      href={event.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="timeline-event__address"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M10 2a5.5 5.5 0 0 0-5.5 5.5C4.5 12 10 18 10 18s5.5-6 5.5-10.5A5.5 5.5 0 0 0 10 2Zm0 7.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{event.address}</span>
                    </a>
                    <p className="timeline-event__tap">
                      <span>View details</span>
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M7 4.5 12.5 10 7 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </p>
                  </div>
                  {event.image && (
                    <img src={event.image} alt={event.name} className="timeline-event__thumb" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedEvent ? <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} /> : null}
    </section>
  );
}
