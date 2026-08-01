export interface WeddingEvent {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
  dressCode?: string;
  meal: string;
  image: string;
}

export interface Venue {
  name: string;
  address: string;
  mapsUrl: string;
  description: string;
}

export interface FamilyMember {
  role: string;
  name: string;
  relation: string;
}

export const WEDDING = {
  couple: {
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
  tagline: "A Celebration of Love & New Beginnings",
  invitationText:
    "With immense joy and the blessings of our families, we request the honour of your gracious presence as we celebrate the wedding of",
} as const;

// TODO: Replace placeholder family details with actual names
export const FAMILY = {
  bride: [
    { role: "Daughter of", name: "Your Father's Name", relation: "and Your Mother's Name" },
    { role: "Granddaughter of", name: "Your Grandfather's Name", relation: "and Your Grandmother's Name" },
  ] satisfies FamilyMember[],
  groom: [
    { role: "Son of", name: "Your Father's Name", relation: "and Your Mother's Name" },
    { role: "Grandson of", name: "Your Grandfather's Name", relation: "and Your Grandmother's Name" },
  ] satisfies FamilyMember[],
};

export const EVENTS: WeddingEvent[] = [
  {
    id: "pasupu-jathara",
    name: "Pasupu Jathara",
    subtitle: "The Celebration",
    date: "Friday, September 4, 2026",
    time: "9:00 AM",
    venue: "Venue Name", // TODO: Replace with actual venue
    address: "123 Venue Address, City, State ZIP", // TODO: Replace
    mapsUrl: "https://maps.google.com/?q=123+Venue+Address", // TODO: Replace
    dressCode: "Yellow Indian Attire",
    meal: "Breakfast will be served",
    image: "/events/pasupu-jathara.jpg",
  },
  {
    id: "pelli-alankarana",
    name: "Pelli Alankarana",
    subtitle: "The Celebration",
    date: "Friday, September 4, 2026",
    time: "1:00 PM",
    venue: "Venue Name", // TODO: Replace
    address: "123 Venue Address, City, State ZIP", // TODO: Replace
    mapsUrl: "https://maps.google.com/?q=123+Venue+Address", // TODO: Replace
    meal: "Lunch will be served",
    image: "/events/pelli-alankarana.jpg",
  },
  {
    id: "gorintaku-sandadi",
    name: "Gorintaku Sandadi",
    subtitle: "The Celebration",
    date: "Friday, September 4, 2026",
    time: "6:30 PM",
    venue: "Venue Name", // TODO: Replace
    address: "123 Venue Address, City, State ZIP", // TODO: Replace
    mapsUrl: "https://maps.google.com/?q=123+Venue+Address", // TODO: Replace
    meal: "Dinner will be served",
    image: "/events/gorintaku-sandadi.jpg",
  },
  {
    id: "kalyana-mahotsavam",
    name: "Kalyana Mahotsavam",
    subtitle: "The Celebration",
    date: "Saturday, September 5, 2026",
    time: "10:59 AM — Sumuhurtham",
    venue: "Venue Name", // TODO: Replace
    address: "456 Venue Address, City, State ZIP", // TODO: Replace
    mapsUrl: "https://maps.google.com/?q=456+Venue+Address", // TODO: Replace
    dressCode: "Traditional Indian Attire",
    meal: "Lunch will be served",
    image: "/events/kalyana-mahotsavam.jpg",
  },
  {
    id: "mr-night",
    name: "MR Night",
    subtitle: "The Celebration",
    date: "Saturday, September 5, 2026",
    time: "6:00 PM",
    venue: "Venue Name", // TODO: Replace
    address: "456 Venue Address, City, State ZIP", // TODO: Replace
    mapsUrl: "https://maps.google.com/?q=456+Venue+Address", // TODO: Replace
    dressCode: "Men: Suits or Blazers · Women: Sarees, Gowns or Elegant Dresses",
    meal: "Dinner and refreshments will be served",
    image: "/events/mr-night.jpg",
  },
];

// TODO: Replace placeholder venues with actual venues
export const VENUES: Venue[] = [
  {
    name: "Venue One",
    address: "123 Venue Address, City, State ZIP",
    mapsUrl: "https://maps.google.com/?q=123+Venue+Address",
    description: "Day 1 celebrations",
  },
  {
    name: "Venue Two",
    address: "456 Venue Address, City, State ZIP",
    mapsUrl: "https://maps.google.com/?q=456+Venue+Address",
    description: "Day 2 celebrations",
  },
];

// TODO: Replace placeholder hotel with actual hotel
export const HOTEL = {
  name: "Hotel Name",
  address: "789 Hotel Address, City, State ZIP",
  bookingUrl: "https://example.com/book",
  details: [
    "Less than 10 minutes from Venue Two",
    "Approximately 20 minutes from Venue One",
  ],
  airport: {
    name: "Nearest Airport Name (CODE)",
    code: "XXX",
  },
};
