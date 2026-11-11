/**
 * Programs and field events. Dates come from the event pages they link to: the
 * Pollinator Week report gives exact dates; the butterfly events are dated by month.
 */
export type ProgramEvent = {
  id: string;
  title: string;
  /** Short date as shown, e.g. "22–28 June 2026" or "September 2026". */
  dateLabel: string;
  /** Start date (ISO) used for ordering. */
  startsOn: string;
  place: string;
  summary: string;
  href: string;
};

const programEvents: ProgramEvent[] = [
  {
    id: "big-butterfly-count-2026",
    title: "Big Butterfly Count 2026",
    dateLabel: "September 2026",
    startsOn: "2026-09-01",
    place: "Godawari, Lalitpur",
    summary: "Opening walk of Big Butterfly Month, with Butterfly Watchers Nepal.",
    href: "/news/big-butterfly-count-2026-godawari-walk",
  },
  {
    id: "pollinator-week-2026",
    title: "Pollinator Week 2026",
    dateLabel: "22–28 June 2026",
    startsOn: "2026-06-22",
    place: "Hetauda and Ranibari, after a pre-week watch in Godawari",
    summary: "Virtual sessions and field pollinator watches with nine partner organizations.",
    href: "/publications/pollinator-week-2026-event-report",
  },
  {
    id: "godawari-butterfly-watch-2026",
    title: "Godawari Butterfly Watch",
    dateLabel: "6 June 2026",
    startsOn: "2026-06-06",
    place: "Godawari, Lalitpur",
    summary: "A community butterfly-watching program that recorded more than 46 species.",
    href: "/news/godawari-butterfly-watch",
  },
];

/** Newest first. */
export function getProgramEvents(): ProgramEvent[] {
  return [...programEvents].sort(
    (a, b) => new Date(b.startsOn).getTime() - new Date(a.startsOn).getTime(),
  );
}
