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
    day3: "September 6, 2026",
    weddingDate: new Date("2026-09-05T21:30:00"),
  },
  line: "SEPTEMBER 5, 2026 · 9:30 PM",
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
    date: "Friday, September 4, 2026",
    time: "9:00 AM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    dressCode: "Yellow Indian Attire",
    meal: "Breakfast",
    accent: "from-[#8f5f2a] to-[#5a6b35]",
    image: "/events/pasupu-jathara.png",
  },
  {
    id: "pelli-alankarana",
    name: "Pelli Alankarana",
    date: "Friday, September 4, 2026",
    time: "11:00 AM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    meal: "Lunch",
    accent: "from-[#9a7b4f] to-[#6b3a27]",
    image: "/events/pelli-alankarana.jpg",
  },
  {
    id: "gorintaku-sandadi",
    name: "Gorintaku Sandadi",
    date: "Friday, September 4, 2026",
    time: "6:00 PM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    meal: "Dinner",
    accent: "from-[#5a6b35] to-[#3f4a23]",
    image: "/events/gorintaku-sandadi.jpg",
  },
  {
    id: "dj-night",
    name: "DJ Night",
    date: "Friday, September 4, 2026",
    time: "8:00 PM",
    venue: "Ranch House",
    address: "708 Sam Davis Rd, Argyle, TX 76226",
    mapsUrl: "https://maps.google.com/?q=708+Sam+Davis+Rd+Argyle+TX+76226",
    dressCode: "Party attire",
    meal: "Dinner and refreshments",
    accent: "from-[#754329] to-[#5a6b35]",
    image: "/events/mr-night.jpg",
  },
  {
    id: "kalyana-mahotsavam",
    name: "Kalyana Mahotsavam",
    date: "Saturday, September 5, 2026",
    time: "9:30 PM (Sumuhurtham)",
    venue: "Atithi Venue",
    address: "9060 Independence Pkwy, Plano, TX 75025",
    mapsUrl: "https://maps.google.com/?q=9060+Independence+Pkwy+Plano+TX+75025",
    dressCode: "Traditional Indian Attire",
    meal: "Lunch",
    accent: "from-[#9a7b4f] to-[#5a6b35]",
    image: "/events/kalyana-mahotsavam.jpg",
  },
  {
    id: "vratham",
    name: "Vratham",
    date: "Sunday, September 6, 2026",
    time: "10:30 AM",
    venue: "House",
    address: "2845 Hale Rd, Celina, TX 75009",
    mapsUrl: "https://maps.google.com/?q=2845+Hale+Rd+Celina+TX+75009",
    meal: "Breakfast",
    accent: "from-[#754329] to-[#5a6b35]",
    image: "/events/vratham.jpg",
  },
] satisfies readonly WeddingEvent[];

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
  {
    id: "venue-day3",
    name: "House",
    address: "2845 Hale Rd, Celina, TX 75009",
    mapsUrl: "https://maps.google.com/?q=2845+Hale+Rd+Celina+TX+75009",
    note: "For Vratham",
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
