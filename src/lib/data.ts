export type AttendanceStatus = "attending" | "tentative" | "decline";

export interface WeddingEvent {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly time: string;
  readonly venue: string;
  readonly address: string;
  readonly mapsUrl: string;
  readonly dressCode?: string;
  readonly meal: string;
  readonly accent: string;
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
  readonly line: string;
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

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/invitation", label: "Invitation" },
  { href: "/events", label: "Events" },
  { href: "/venue", label: "Venue" },
  { href: "/hotel", label: "Hotel" },
  { href: "/rsvp", label: "RSVP" },
] as const;

export const WEDDING = {
  couple: {
    short: "Manas & Rupa",
    monogram: "M&R",
    groom: {
      firstName: "Manas",
      fullName: "Manas Adusumilli",
    },
    bride: {
      firstName: "Rupa",
      fullName: "Rupa Sree Pamulapati",
    },
  },
  hashtag: "#MR",
  dates: {
    day1: "September 4, 2026",
    day2: "September 5, 2026",
    weddingDate: new Date("2026-09-05T10:59:00"),
  },
  line: "THE BEGINNING OF FOREVER",
  invitationTagline: "A CELEBRATION OF LOVE & NEW BEGINNINGS",
  invitationText:
    "With immense joy and the blessings of our families, we request the honour of your gracious presence as we celebrate our wedding ceremonies.",
} as const;

export const FAMILY = {
  bride: [
    { role: "D/O", line: "TODO: Bride's father name & bride's mother name" },
    { role: "Granddaughter of", line: "TODO: Bride's grandparents" },
  ] satisfies readonly FamilyMember[],
  groom: [
    { role: "S/O", line: "TODO: Groom's father name & groom's mother name" },
    { role: "Grandson of", line: "TODO: Groom's grandparents" },
  ] satisfies readonly FamilyMember[],
} as const;

export const EVENTS = [
  {
    id: "pasupu-jathara",
    name: "Pasupu Jathara",
    date: "Friday, September 4, 2026",
    time: "9:00 AM",
    venue: "TODO: Venue name",
    address: "TODO: Venue address",
    mapsUrl: "https://maps.google.com",
    dressCode: "Yellow Indian Attire",
    meal: "Breakfast will be served",
    accent: "from-[#8f5f2a] to-[#5a6b35]",
  },
  {
    id: "pelli-alankarana",
    name: "Pelli Alankarana",
    date: "Friday, September 4, 2026",
    time: "1:00 PM",
    venue: "TODO: Venue name",
    address: "TODO: Venue address",
    mapsUrl: "https://maps.google.com",
    meal: "Lunch will be served",
    accent: "from-[#9a7b4f] to-[#6b3a27]",
  },
  {
    id: "gorintaku-sandadi",
    name: "Gorintaku Sandadi",
    date: "Friday, September 4, 2026",
    time: "6:30 PM",
    venue: "TODO: Venue name",
    address: "TODO: Venue address",
    mapsUrl: "https://maps.google.com",
    meal: "Dinner will be served",
    accent: "from-[#5a6b35] to-[#3f4a23]",
  },
  {
    id: "kalyana-mahotsavam",
    name: "Kalyana Mahotsavam",
    date: "Saturday, September 5, 2026",
    time: "10:59 AM (Sumuhurtham)",
    venue: "TODO: Main wedding venue",
    address: "TODO: Main wedding address",
    mapsUrl: "https://maps.google.com",
    dressCode: "Traditional Indian Attire",
    meal: "Lunch will be served",
    accent: "from-[#9a7b4f] to-[#5a6b35]",
  },
  {
    id: "mr-night",
    name: "MR Night",
    date: "Saturday, September 5, 2026",
    time: "6:00 PM",
    venue: "TODO: Reception venue",
    address: "TODO: Reception address",
    mapsUrl: "https://maps.google.com",
    dressCode: "Elegant evening attire",
    meal: "Dinner and refreshments will be served",
    accent: "from-[#754329] to-[#5a6b35]",
  },
] satisfies readonly WeddingEvent[];

export const VENUES = [
  {
    id: "venue-day1",
    name: "TODO: Day 1 Venue",
    address: "TODO: Full address",
    mapsUrl: "https://maps.google.com",
    note: "For Pasupu Jathara, Pelli Alankarana, and Gorintaku Sandadi",
  },
  {
    id: "venue-day2",
    name: "TODO: Day 2 Venue",
    address: "TODO: Full address",
    mapsUrl: "https://maps.google.com",
    note: "For Kalyana Mahotsavam and MR Night",
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
