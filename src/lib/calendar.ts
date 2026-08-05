import { WEDDING_EVENT, type WeddingEvent } from "@/lib/data";

const CALENDAR_TIMEZONE = "America/Chicago";
const DEFAULT_CALENDAR_NAME = "Manas & Rupa Sree Wedding Celebrations";
const DEFAULT_FILENAME = "manas-rupa-marriage.ics";

function normalizeEvents(events?: WeddingEvent | readonly WeddingEvent[] | Event): readonly WeddingEvent[] {
  if (!events || "preventDefault" in events) return [WEDDING_EVENT];
  return (Array.isArray(events) ? events : [events]).filter(Boolean);
}

function compactDateTime(value: string): string {
  return String(value || "").replace(/[-:]/g, "");
}

function utcStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value = ""): string {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldIcsLine(line: string): string {
  const limit = 75;
  if (line.length <= limit) return line;

  const chunks: string[] = [];
  let remaining = line;
  while (remaining.length > limit) {
    chunks.push(remaining.slice(0, limit));
    remaining = remaining.slice(limit);
  }
  chunks.push(remaining);
  return chunks.join("\r\n ");
}

function titleForEvent(event: WeddingEvent): string {
  return `Manas & Rupa Sree - ${event.name}`;
}

function locationForEvent(event: WeddingEvent): string {
  return [event.venue, event.address].filter(Boolean).join(", ");
}

function detailsForEvent(event: WeddingEvent): string {
  return [
    event.description,
    "",
    event.dateLabel && event.timeLabel ? `${event.dateLabel} · ${event.timeLabel}` : "",
    event.venue ? `Venue: ${event.venue}` : "",
    event.address ? `Address: ${event.address}` : "",
    event.meal ? `Meal: ${event.meal}` : "",
    event.dressCode ? `Attire: ${event.dressCode}` : "",
    event.mapUrl ? `Map: ${event.mapUrl}` : "",
  ].filter(Boolean).join("\n");
}

function createCalendarInvite(events?: WeddingEvent | readonly WeddingEvent[], options: { calendarName?: string } = {}) {
  const eventList = normalizeEvents(events);
  const stamp = utcStamp();
  const calendarName = options.calendarName || DEFAULT_CALENDAR_NAME;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manas & Rupa Sree Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    `X-WR-TIMEZONE:${CALENDAR_TIMEZONE}`,
    ...eventList.flatMap((event) => [
      "BEGIN:VEVENT",
      `UID:manas-rupa-2026-${event.id || compactDateTime(event.dateTime)}@mr-wedding`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=${CALENDAR_TIMEZONE}:${compactDateTime(event.dateTime)}`,
      `DTEND;TZID=${CALENDAR_TIMEZONE}:${compactDateTime(event.endDateTime)}`,
      `SUMMARY:${escapeIcsText(titleForEvent(event))}`,
      `DESCRIPTION:${escapeIcsText(detailsForEvent(event))}`,
      `LOCATION:${escapeIcsText(locationForEvent(event))}`,
      "STATUS:CONFIRMED",
      "SEQUENCE:0",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcsText(`${titleForEvent(event)} - Tomorrow!`)}`,
      "END:VALARM",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ];

  return lines.map(foldIcsLine).join("\r\n");
}

export function getGoogleCalendarUrl(event = WEDDING_EVENT): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: titleForEvent(event),
    dates: `${compactDateTime(event.dateTime)}/${compactDateTime(event.endDateTime)}`,
    details: detailsForEvent(event),
    location: locationForEvent(event),
    ctz: CALENDAR_TIMEZONE,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function addGoogleCalendarInvite(events?: WeddingEvent | readonly WeddingEvent[], options: { filename?: string; calendarName?: string } = {}) {
  const eventList = normalizeEvents(events);

  if (eventList.length === 1) {
    window.open(getGoogleCalendarUrl(eventList[0]), "_blank", "noopener,noreferrer");
    return;
  }

  downloadCalendarInvite(eventList, {
    filename: "manas-rupa-google-calendar.ics",
    ...options,
  });
}

export function downloadCalendarInvite(events?: WeddingEvent | readonly WeddingEvent[], options: { filename?: string; calendarName?: string } = {}) {
  const eventList = normalizeEvents(events);
  const filename = options.filename || (eventList.length > 1 ? "manas-rupa-celebrations.ics" : DEFAULT_FILENAME);
  const icsContent = createCalendarInvite(eventList, options);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
