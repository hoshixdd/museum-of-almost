export const APP_NAME = "The Museum of Almost";
export const APP_TAGLINE = "A home for everything that almost happened.";
export const APP_DESCRIPTION =
  "An anonymous digital museum of unsent letters, alternate lives, time capsules, and memories that never found a voice.";

export const MEMORY_CATEGORIES = [
  "Love",
  "Goodbye",
  "Family",
  "Friendship",
  "Apology",
  "Regret",
  "Younger Self",
  "Future Self",
  "Lost Opportunities",
] as const;

export const EMOTIONS = [
  "Love",
  "Sadness",
  "Hope",
  "Anger",
  "Nostalgia",
  "Healing",
  "Fear",
] as const;

export const LIFE_CATEGORIES = [
  "Almost Career",
  "Almost Love",
  "Almost Place",
  "Almost Family",
  "Almost Self",
] as const;

export const VOICE_CATEGORIES = [
  "Confessions",
  "Last Words",
  "Memories",
  "Dreams",
  "Letters",
] as const;

export const CAPSULE_RECIPIENTS = [
  "Future self",
  "Stranger",
  "Family",
  "Someone specific",
] as const;

export const REPORT_REASONS = [
  "Harassment",
  "Hate speech",
  "Personal information",
  "Threats or harm",
  "Spam or off-topic",
  "Something else",
] as const;

export const REACTIONS = [
  { key: "needed", label: "I needed this" },
  { key: "understand", label: "I understand" },
  { key: "reminded", label: "This reminded me of someone" },
] as const;

export const SUGGESTED_CITIES = [
  "Manila",
  "Tokyo",
  "New York",
  "London",
  "Paris",
  "Seoul",
  "Lagos",
  "São Paulo",
  "Mexico City",
  "Cairo",
  "Mumbai",
  "Berlin",
  "Istanbul",
  "Melbourne",
  "Toronto",
  "Cape Town",
  "Singapore",
  "Dublin",
  "Barcelona",
  "Lisbon",
] as const;

export const MAP_CITIES: {
  city: string;
  region: string;
  x: number;
  y: number;
}[] = [
  { city: "Vancouver", region: "Canada", x: 12, y: 32 },
  { city: "Toronto", region: "Canada", x: 24, y: 34 },
  { city: "New York", region: "United States", x: 26, y: 38 },
  { city: "Chicago", region: "United States", x: 21, y: 38 },
  { city: "Portland", region: "United States", x: 13, y: 36 },
  { city: "Mexico City", region: "Mexico", x: 18, y: 50 },
  { city: "São Paulo", region: "Brazil", x: 34, y: 72 },
  { city: "London", region: "United Kingdom", x: 47, y: 32 },
  { city: "Paris", region: "France", x: 48.5, y: 35 },
  { city: "Berlin", region: "Germany", x: 51, y: 32 },
  { city: "Dublin", region: "Ireland", x: 45, y: 31 },
  { city: "Lisbon", region: "Portugal", x: 45.5, y: 40 },
  { city: "Barcelona", region: "Spain", x: 48, y: 39 },
  { city: "Vienna", region: "Austria", x: 52, y: 35 },
  { city: "Istanbul", region: "Türkiye", x: 56, y: 38 },
  { city: "Cairo", region: "Egypt", x: 56, y: 46 },
  { city: "Lagos", region: "Nigeria", x: 49, y: 54 },
  { city: "Cape Town", region: "South Africa", x: 53, y: 80 },
  { city: "Mumbai", region: "India", x: 68, y: 50 },
  { city: "Singapore", region: "Singapore", x: 76, y: 58 },
  { city: "Manila", region: "Philippines", x: 81, y: 54 },
  { city: "Hong Kong", region: "China", x: 79, y: 48 },
  { city: "Seoul", region: "South Korea", x: 82, y: 38 },
  { city: "Tokyo", region: "Japan", x: 86, y: 38 },
  { city: "Taipei", region: "Taiwan", x: 81, y: 46 },
  { city: "Melbourne", region: "Australia", x: 86, y: 82 },
  { city: "Brooklyn", region: "United States", x: 26.6, y: 39 },
  { city: "Boston", region: "United States", x: 27.4, y: 36.5 },
];

export const ROOMS = [
  {
    slug: "archive",
    roman: "I",
    name: "The Unsent Archive",
    line: "Letters written and never sent.",
    href: "/archive",
  },
  {
    slug: "lives",
    roman: "II",
    name: "The Almost Lives",
    line: "The versions of us that stayed imaginary.",
    href: "/lives",
  },
  {
    slug: "vault",
    roman: "III",
    name: "The Time Vault",
    line: "Messages locked for a later hour.",
    href: "/vault",
  },
  {
    slug: "voice",
    roman: "IV",
    name: "The Voice Room",
    line: "Spoken memories, one at a time.",
    href: "/voice",
  },
  {
    slug: "library",
    roman: "V",
    name: "The Human Library",
    line: "Anonymous lives, bound as books.",
    href: "/library",
  },
  {
    slug: "map",
    roman: "VI",
    name: "The Emotion Map",
    line: "Where feeling gathers, city by city.",
    href: "/map",
  },
  {
    slug: "wall",
    roman: "VII",
    name: "The Stranger Wall",
    line: "Quiet replies. No advice. No audience.",
    href: "/wall",
  },
  {
    slug: "exit",
    roman: "VIII",
    name: "The Exit Wall",
    line: "Leave something before you go.",
    href: "/exit",
  },
] as const;

export const ANNEXES = [
  {
    slug: "needed",
    name: "Something I Need To Hear",
    line: "A single artifact, chosen without ranking.",
    href: "/needed",
  },
  {
    slug: "midnight",
    name: "The Midnight Archive",
    line: "Stories left between midnight and dawn.",
    href: "/midnight",
  },
  {
    slug: "forgotten",
    name: "The Forgotten Room",
    line: "A rotating exhibition of hidden memories.",
    href: "/forgotten",
  },
  {
    slug: "curator",
    name: "The Curator",
    line: "An attendant who helps you find a story.",
    href: "/curator",
  },
] as const;

export const SUPPORT_RESOURCES = [
  {
    name: "International Association for Suicide Prevention",
    href: "https://www.iasp.info/suicidalthoughts/",
  },
  {
    name: "988 Suicide & Crisis Lifeline (US)",
    href: "https://988lifeline.org/",
  },
  {
    name: "Find a Helpline",
    href: "https://findahelpline.com/",
  },
] as const;
