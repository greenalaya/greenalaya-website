/**
 * Places shown on the "Where we work" map (draft). Locations are approximate and only
 * for orientation. Facts come from the linked news posts, project pages and the
 * Pollinator Week 2026 report.
 */
export type WorkTheme = "butterflies" | "pollinators";

export type WorkActivity = {
  title: string;
  date: string;
  theme: WorkTheme;
  partners: string[];
  href: string;
};

export type WorkSite = {
  id: string;
  name: string;
  district: string;
  province: string;
  lat: number;
  lon: number;
  kind: "site" | "base";
  activities: WorkActivity[];
};

export const workThemes: { id: WorkTheme; label: string }[] = [
  { id: "butterflies", label: "Butterflies & moths" },
  { id: "pollinators", label: "Pollinators" },
];

const butterflyBook = "/projects/kathmandu-valley-butterfly-documentation";
const pollinatorReport = "/publications/pollinator-week-2026-event-report";

export const workSites: WorkSite[] = [
  {
    id: "godawari",
    name: "Godawari",
    district: "Lalitpur",
    province: "Bagmati",
    lat: 27.5953,
    lon: 85.3804,
    kind: "site",
    activities: [
      {
        title: "Big Butterfly Count 2026 walk",
        date: "September 2026",
        theme: "butterflies",
        partners: ["Butterfly Watchers Nepal"],
        href: "/news/big-butterfly-count-2026-godawari-walk",
      },
      {
        title: "Godawari Butterfly Watch (Pollinator Week pre-week program)",
        date: "6 June 2026",
        theme: "butterflies",
        partners: [
          "Butterfly Watchers Nepal",
          "TinyLife Finders",
          "Club for Wildlife Conservation",
        ],
        href: "/news/godawari-butterfly-watch",
      },
    ],
  },
  {
    id: "ranibari",
    name: "Ranibari Community Forest",
    district: "Kathmandu",
    province: "Bagmati",
    lat: 27.727,
    lon: 85.32,
    kind: "site",
    activities: [
      {
        title: "Pollinator Week field watch",
        date: "28 June 2026",
        theme: "pollinators",
        partners: ["nine partner organizations"],
        href: pollinatorReport,
      },
    ],
  },
  {
    id: "hetauda",
    name: "Hetauda Forestry Complex",
    district: "Makwanpur",
    province: "Bagmati",
    lat: 27.4236,
    lon: 85.0367,
    kind: "site",
    activities: [
      {
        title: "Pollinator Week field watch",
        date: "22 June 2026",
        theme: "pollinators",
        partners: ["nine partner organizations"],
        href: pollinatorReport,
      },
    ],
  },
  {
    id: "pokhara",
    name: "Pokhara",
    district: "Kaski",
    province: "Gandaki",
    lat: 28.2096,
    lon: 83.9856,
    kind: "base",
    activities: [],
  },
];

/**
 * District-wide work, shown by shading the district in the Kathmandu Valley inset. The
 * label point (lat/lon) is where the location count is drawn, not a single site.
 */
export const districtProjects = [
  { district: "Kathmandu", locations: 22, lat: 27.79, lon: 85.4 },
  { district: "Lalitpur", locations: 6, lat: 27.535, lon: 85.33 },
  { district: "Bhaktapur", locations: 6, lat: 27.672, lon: 85.448 },
].map((item) => ({
  ...item,
  title: "Kathmandu Valley butterfly documentation",
  theme: "butterflies" as WorkTheme,
  partners: ["TinyLife Finders"],
  date: "Published April 2026",
  href: butterflyBook,
}));

/** A whole-province project, shown by shading the province rather than with a pin. */
export const provinceProjects = [
  {
    province: "Bagmati",
    title: "Moths of Bagmati Province",
    status: "Ongoing · collecting photographs",
    theme: "butterflies" as WorkTheme,
    href: "/projects/moths-of-bagmati-province",
  },
];
