/**
 * "Our impact so far" on the homepage: the year's milestones in the order they happened, each
 * with figures the organisation can back with a source. Nothing here is an estimate: each
 * figure is copied from the publication, report or article named beside it.
 *
 * Figures marked "+" are minimums, as in the reports. Counts from different programs overlap
 * (the same person may have joined several), so they are never added together.
 *
 * Still a draft, to be confirmed by the team: while `impactIsDraft` is true the section stays
 * off the homepage, except on the test page that shows it for review.
 */
export const impactIsDraft = true;

export type ImpactFigure = { value: string; label: string };

export type ImpactSource = { label: string; href: string; external?: boolean };

const sources = {
  book: {
    label: "Butterfly Images of Kathmandu Valley",
    href: "/publications/butterfly-images-kathmandu-valley",
  },
  pollinatorWeek: {
    label: "Pollinator Week 2026 report",
    href: "/publications/pollinator-week-2026-event-report",
  },
  godawari: { label: "Godawari Butterfly Watch", href: "/news/godawari-butterfly-watch" },
  countBegins: {
    label: "The Kathmandu Post, 16 September 2026",
    href: "https://kathmandupost.com/climate-environment/2026/09/16/nepal-begins-a-nationwide-butterfly-count",
    external: true,
  },
  countResults: {
    label: "The Kathmandu Post, 8 October 2026",
    href: "https://kathmandupost.com/national/2026/10/08/fourth-butterfly-count-records-173-species-across-six-provinces",
    external: true,
  },
} satisfies Record<string, ImpactSource>;

export type ImpactMilestone = {
  id: string;
  dateLabel: string;
  title: string;
  figures: ImpactFigure[];
  source?: ImpactSource;
  /** Still under way: shown as what comes next, with no figures yet. */
  upcoming?: boolean;
};

/** The year in order. */
export const impactMilestones: ImpactMilestone[] = [
  {
    id: "established",
    dateLabel: "February 2026",
    title: "Greenalaya Nepal established",
    figures: [],
  },
  {
    id: "book",
    dateLabel: "April 2026",
    title: "Butterfly Images of Kathmandu Valley published",
    figures: [
      { value: "174", label: "species" },
      { value: "503", label: "photographs" },
    ],
    source: sources.book,
  },
  {
    id: "godawari",
    dateLabel: "6 June 2026",
    title: "Godawari Butterfly Watch",
    figures: [
      { value: "45+", label: "participants" },
      { value: "46+", label: "species" },
    ],
    source: sources.godawari,
  },
  {
    id: "pollinator-week",
    dateLabel: "22–28 June 2026",
    title: "Pollinator Week 2026",
    figures: [
      { value: "200+", label: "attendance" },
      { value: "9", label: "partners" },
    ],
    source: sources.pollinatorWeek,
  },
  {
    id: "count",
    dateLabel: "September 2026",
    title: "National Big Butterfly Count",
    figures: [
      { value: "100+", label: "volunteers" },
      { value: "25", label: "sites" },
    ],
    source: sources.countBegins,
  },
  {
    id: "count-results",
    dateLabel: "October 2026",
    title: "Count results announced",
    figures: [
      { value: "173", label: "species" },
      { value: "15", label: "districts" },
    ],
    source: sources.countResults,
  },
  {
    id: "moths",
    dateLabel: "Now",
    title: "Moths of Bagmati Province: open for photographs",
    figures: [],
    source: { label: "About the project", href: "/projects/moths-of-bagmati-province" },
    upcoming: true,
  },
];
