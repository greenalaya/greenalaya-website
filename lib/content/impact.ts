/**
 * Headline figures (draft, to be confirmed by the team). Every figure carries the source
 * it was taken from; counts from different programs overlap, so they are not added up.
 */
export type ImpactStat = {
  id: string;
  value: string;
  label: string;
  source: { label: string; href: string; external?: boolean };
};

export const impactIsDraft = true;

export const impactStats: ImpactStat[] = [
  {
    id: "species",
    value: "174",
    label: "Butterfly species documented in Kathmandu Valley",
    source: {
      label: "Butterfly Images of Kathmandu Valley",
      href: "/publications/butterfly-images-kathmandu-valley",
    },
  },
  {
    id: "participants",
    value: "200+",
    label: "People took part in Pollinator Week 2026",
    source: {
      label: "Pollinator Week 2026 report",
      href: "/publications/pollinator-week-2026-event-report",
    },
  },
  {
    id: "districts",
    value: "15",
    label: "Districts in the 2026 national butterfly count we coordinated",
    source: {
      label: "The Kathmandu Post",
      href: "https://kathmandupost.com/national/2026/10/08/fourth-butterfly-count-records-173-species-across-six-provinces",
      external: true,
    },
  },
  {
    id: "partners",
    value: "9",
    label: "Partner organizations in Pollinator Week 2026",
    source: {
      label: "Pollinator Week 2026 report",
      href: "/publications/pollinator-week-2026-event-report",
    },
  },
  {
    id: "publications",
    // Replaced at render time with the live count from the publications list.
    value: "2",
    label: "Research publications, free to read",
    source: { label: "Publications", href: "/publications" },
  },
];
