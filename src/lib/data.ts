export type AttendanceStatus = "attending" | "tentative" | "decline";
export type RsvpAttendance = "yes" | "no";
export type InvitationMode = "full" | "wedding-only";

export interface WeddingEvent {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly category: string;
  readonly date: string;
  readonly dateLabel: string;
  readonly dateTime: string;
  readonly endDateTime: string;
  readonly time: string;
  readonly timeLabel: string;
  readonly venue: string;
  readonly address: string;
  readonly mapsUrl: string;
  readonly mapUrl: string;
  readonly city: string;
  readonly description: string;
  readonly dressCode?: string;
  readonly meal: string;
  readonly accent: string;
  readonly image: string;
}

export interface Venue {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly mapsUrl: string;
  readonly note: string;
}

export interface FamilyMember {
  readonly role: string;
  readonly name: string;
  readonly relation: string;
}

export interface HotelInfo {
  readonly name: string;
  readonly address: string;
  readonly bookingUrl: string;
  readonly details: readonly string[];
  readonly airport: {
    readonly name: string;
    readonly note: string;
  };
}

export interface RSVPGuestResponse {
  readonly firstName: string;
  readonly lastName?: string;
  readonly name?: string;
  readonly attending?: RsvpAttendance | "";
  readonly eventResponses?: Record<string, RsvpAttendance | "">;
}

export interface RSVPEventAttendance {
  readonly id: string;
  readonly name: string;
  readonly dateLabel: string;
  readonly timeLabel: string;
  readonly venue: string;
  readonly attending: RsvpAttendance | "";
  readonly primaryGuest?: RSVPGuestResponse;
  readonly guestResponses?: readonly RSVPGuestResponse[];
  readonly guestCount?: number;
}

export interface RSVPRecordLike {
  readonly primaryGuest?: {
    readonly firstName?: string;
    readonly lastName?: string;
    readonly attending?: RsvpAttendance | "";
  };
  readonly additionalGuests?: readonly RSVPGuestResponse[];
  readonly eventAttendance?: readonly RSVPEventAttendance[];
}

export const INVITATION_MODES = {
  FULL: "full",
  WEDDING_ONLY: "wedding-only",
} as const;

export const FULL_INVITE_BASE_PATH = "/marriage/celebrations";
export const WEDDING_ONLY_BASE_PATH = "/wedding";
export const WEDDING_EVENT_ID = "kalyana-mahotsavam";

export const NAV_LINKS = [
  { href: WEDDING_ONLY_BASE_PATH, label: "Home" },
  { href: `${WEDDING_ONLY_BASE_PATH}/rsvp`, label: "RSVP" },
] as const;

export const WEDDING = {
  couple: {
    short: "Manas & Rupa Sree",
    monogram: "M&R",
    groom: {
      firstName: "Manas",
      fullName: "Manas Adusumilli",
    },
    bride: {
      firstName: "Rupa Sree",
      fullName: "Rupa Sree Pamulapati",
    },
  },
  hashtag: "#MR",
  dates: {
    day1: "September 4, 2026",
    day2: "September 5, 2026",
    weddingDate: new Date("2026-09-05T21:31:00"),
  },
  line: "SEPTEMBER 5, 2026 · 9:31 PM",
  invitationTagline: "A CELEBRATION OF LOVE & NEW BEGINNINGS",
  invitationText:
    "With immense joy and the blessings of our families, we request the honour of your gracious presence as we celebrate our wedding ceremonies.",
} as const;

export const FAMILY = {
  bride: [
    { role: "D/O", name: "Vasu Deva Rao Pamulapati", relation: "and Sucharitha Pamulapati" },
  ] satisfies readonly FamilyMember[],
  groom: [
    { role: "S/O", name: "Venkateshwara Rao Adusumilli", relation: "and Shyamala Adusumilli" },
  ] satisfies readonly FamilyMember[],
} as const;

export const EVENTS = [
  {
    id: "pasupu-jathara",
    name: "Pasupu Jathara",
    shortName: "Pasupu",
    category: "Pre-wedding",
    date: "Friday, September 4, 2026",
    dateLabel: "Friday, September 4, 2026",
    dateTime: "2026-09-04T09:00:00",
    endDateTime: "2026-09-04T10:30:00",
    time: "9:00 AM",
    timeLabel: "9:00 AM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    mapUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    city: "Argyle, Texas",
    description: "A bright turmeric celebration with family blessings and the start of wedding festivities.",
    dressCode: "Yellow Indian Attire",
    meal: "Breakfast",
    accent: "from-[#8f5f2a] to-[#5a6b35]",
    image: "/events/pasupu-jathara.png",
  },
  {
    id: "pelli-alankarana",
    name: "Pelli Alankarana",
    shortName: "Alankarana",
    category: "Pre-wedding",
    date: "Friday, September 4, 2026",
    dateLabel: "Friday, September 4, 2026",
    dateTime: "2026-09-04T11:00:00",
    endDateTime: "2026-09-04T13:00:00",
    time: "11:00 AM",
    timeLabel: "11:00 AM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    mapUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    city: "Argyle, Texas",
    description: "Traditional pre-wedding adornment ceremonies for the bride and groom.",
    meal: "Lunch",
    accent: "from-[#9a7b4f] to-[#6b3a27]",
    image: "/events/pelli-alankarana.jpg",
  },
  {
    id: "gorintaku-sandadi",
    name: "Gorintaku Sandadi",
    shortName: "Gorintaku",
    category: "Pre-wedding",
    date: "Friday, September 4, 2026",
    dateLabel: "Friday, September 4, 2026",
    dateTime: "2026-09-04T18:00:00",
    endDateTime: "2026-09-04T20:00:00",
    time: "6:00 PM",
    timeLabel: "6:00 PM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    mapUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    city: "Argyle, Texas",
    description: "An evening of henna, music, family, and relaxed celebration.",
    meal: "Dinner",
    accent: "from-[#5a6b35] to-[#3f4a23]",
    image: "/events/gorintaku-sandadi.jpg",
  },
  {
    id: "dj-night",
    name: "DJ Night",
    shortName: "DJ Night",
    category: "Pre-wedding",
    date: "Friday, September 4, 2026",
    dateLabel: "Friday, September 4, 2026",
    dateTime: "2026-09-04T20:00:00",
    endDateTime: "2026-09-04T23:30:00",
    time: "8:00 PM",
    timeLabel: "8:00 PM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    mapUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    city: "Argyle, Texas",
    description: "Dance the night away with music, dinner, and refreshments.",
    dressCode: "Party attire",
    meal: "Dinner and refreshments",
    accent: "from-[#754329] to-[#5a6b35]",
    image: "/events/mr-night.jpg",
  },
  {
    id: "kalyana-mahotsavam",
    name: "Kalyana Mahotsavam",
    shortName: "Wedding",
    category: "Wedding day",
    date: "Saturday, September 5, 2026",
    dateLabel: "Saturday, September 5, 2026",
    dateTime: "2026-09-05T21:31:00",
    endDateTime: "2026-09-05T23:30:00",
    time: "9:31 PM (Sumuhurtham)",
    timeLabel: "9:31 PM (Sumuhurtham)",
    venue: "Atithi Venue",
    address: "9060 Independence Pkwy, Plano, TX 75025",
    mapsUrl: "https://maps.google.com/?q=9060+Independence+Pkwy+Plano+TX+75025",
    mapUrl: "https://maps.google.com/?q=9060+Independence+Pkwy+Plano+TX+75025",
    city: "Plano, Texas",
    description: "Join us for the wedding ceremony. Sumuhurtham is at 9:31 PM.",
    dressCode: "Traditional Indian Attire",
    meal: "Dinner",
    accent: "from-[#9a7b4f] to-[#5a6b35]",
    image: "/events/kalyana-mahotsavam.jpg",
  },
] satisfies readonly WeddingEvent[];

export const WEDDING_EVENT = EVENTS.find((event) => event.id === WEDDING_EVENT_ID) ?? EVENTS[0];
export const ADDITIONAL_EVENT_DETAILS = EVENTS.filter((event) => event.id !== WEDDING_EVENT_ID);
export const FULL_EVENT_DETAILS = EVENTS;

export function getInvitationModeFromPath(pathname = ""): InvitationMode {
  return pathname === FULL_INVITE_BASE_PATH || pathname.startsWith(`${FULL_INVITE_BASE_PATH}/`)
    ? INVITATION_MODES.FULL
    : INVITATION_MODES.WEDDING_ONLY;
}

export function getInvitationConfig(mode: InvitationMode = INVITATION_MODES.FULL) {
  const weddingOnly = mode === INVITATION_MODES.WEDDING_ONLY;

  return {
    mode: weddingOnly ? INVITATION_MODES.WEDDING_ONLY : INVITATION_MODES.FULL,
    label: weddingOnly ? "Wedding-only invite" : "Full celebration invite",
    showAllEvents: !weddingOnly,
    homePath: weddingOnly ? WEDDING_ONLY_BASE_PATH : FULL_INVITE_BASE_PATH,
    rsvpPath: weddingOnly ? `${WEDDING_ONLY_BASE_PATH}/rsvp` : `${FULL_INVITE_BASE_PATH}/rsvp`,
    events: weddingOnly ? [WEDDING_EVENT] : FULL_EVENT_DETAILS,
    additionalEvents: weddingOnly ? [] : ADDITIONAL_EVENT_DETAILS,
  } as const;
}

export function getAttendanceText(value: string | undefined): string {
  if (value === "yes") return "Attending";
  if (value === "no") return "Not attending";
  return "No response";
}

export function normalizeEventAttendance(rsvp: RSVPRecordLike | null | undefined): readonly RSVPEventAttendance[] {
  if (Array.isArray(rsvp?.eventAttendance) && rsvp.eventAttendance.length > 0) {
    return rsvp.eventAttendance.map((event) => {
      const guestResponses: readonly RSVPGuestResponse[] = Array.isArray(event.guestResponses) ? event.guestResponses : [];
      const inferredGuestCount = (event.attending === "yes" ? 1 : 0) +
        guestResponses.filter((guest) => guest.attending === "yes").length;
      const storedGuestCount = Number(event.guestCount);

      return {
        ...event,
        guestResponses,
        guestCount: Number.isFinite(storedGuestCount) ? storedGuestCount : inferredGuestCount,
      };
    });
  }

  const attending = rsvp?.primaryGuest?.attending || "";
  return [{
    id: WEDDING_EVENT.id,
    name: WEDDING_EVENT.name,
    dateLabel: WEDDING_EVENT.dateLabel,
    timeLabel: WEDDING_EVENT.timeLabel,
    venue: WEDDING_EVENT.venue,
    attending,
    guestCount: attending === "yes"
      ? 1 + (rsvp?.additionalGuests?.filter((guest) => guest.firstName)?.length || 0)
      : 0,
  }];
}

export const VENUES = [
  {
    id: "venue-day1",
    name: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    note: "For Pasupu Jathara, Pelli Alankarana, Gorintaku Sandadi, and DJ Night",
  },
  {
    id: "venue-day2",
    name: "Atithi Venue",
    address: "9060 Independence Pkwy, Plano, TX 75025",
    mapsUrl: "https://maps.google.com/?q=9060+Independence+Pkwy+Plano+TX+75025",
    note: "For Kalyana Mahotsavam",
  },
] satisfies readonly Venue[];

export const HOTEL = {
  name: "TODO: Nearby Hotel Name",
  address: "TODO: Hotel address",
  bookingUrl: "https://example.com",
  details: [
    "TODO: Distance from Day 1 venue",
    "TODO: Distance from Day 2 venue",
    "TODO: Booking code or contact",
  ],
  airport: {
    name: "TODO: Nearest Airport",
    note: "TODO: Airport transfer details",
  },
} satisfies HotelInfo;
