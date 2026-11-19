/**
 * The field sites shown as dots on the "Where We Work" map: the Butterfly Watch Event in
 * Godawari (6 June 2026) and the two Pollinator Week 2026 field watches (22 and 28 June).
 * Every figure is from the Pollinator Week 2026 event report
 * (public/publications/pollinator_week_2026_event_report.pdf); its "+" figures are minimums.
 */

export type FieldEventSite = {
  /** Id of the place in lib/content/work-sites.ts, which holds its position. */
  siteId: string;
  /** The event held there: the first line of its card. */
  event: string;
  location: string;
  participants: string;
  found: string;
  /** The page about the event: its news post or report (the research map's "Read more"). */
  href: string;
};

const pollinatorReport = "/publications/pollinator-week-2026-event-report";

/** In date order. */
export const fieldEventSites: FieldEventSite[] = [
  {
    siteId: "godawari",
    event: "Butterfly Watch Event",
    location: "Godawari Forest Area",
    participants: "45+ Participants",
    found: "46+ Butterflies found",
    href: "/news/godawari-butterfly-watch",
  },
  {
    siteId: "hetauda",
    event: "Pollinator Week 2026",
    location: "Forestry Complex, Hetauda",
    participants: "18+ Participants",
    found: "10+ Pollinators found",
    href: pollinatorReport,
  },
  {
    siteId: "ranibari",
    event: "Pollinator Week 2026",
    location: "Ranibari Community Forest, Kathmandu",
    participants: "28+ Participants",
    found: "22 Pollinators found",
    href: pollinatorReport,
  },
];
