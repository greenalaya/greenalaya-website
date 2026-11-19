/**
 * The points on the homepage's "Where We Work" map (components/home/home-work-map.tsx): the
 * field events in lib/content/field-event-sites.ts, placed by their site in
 * lib/content/work-sites.ts, and the office.
 *
 * To add a point, add the event to field-event-sites.ts (and its place to work-sites.ts).
 *
 * Locations are approximate, plotted for orientation rather than survey-grade precision.
 */
import { fieldEventSites } from "@/lib/content/field-event-sites";
import { workSites } from "@/lib/content/work-sites";

/** Marker colours: butterflies brown, pollinators green, and the office in the site's action
 * colour (dark green in the light theme, light green in the dark one). */
export const fieldMapColours = {
  butterflies: "#b27c3e",
  pollinators: "#4f7a3a",
  office: "var(--home-action)",
} as const;

export type FieldMapCategory = keyof typeof fieldMapColours;

export type FieldMapSite = {
  id: string;
  name: string;
  /** The small line above the name: where it is. */
  tag: string;
  category: FieldMapCategory;
  coords: [number, number];
  body: string;
  href?: string;
};

/** The field events, with the homepage card's lines: event, place, people and finds. */
const events: FieldMapSite[] = fieldEventSites.flatMap((event): FieldMapSite[] => {
  const site = workSites.find((place) => place.id === event.siteId);
  if (!site) return [];
  const pollinators = event.event.toLowerCase().includes("pollinator");
  return [
    {
      id: event.siteId,
      name: event.event,
      tag: event.location,
      category: pollinators ? "pollinators" : "butterflies",
      coords: [site.lat, site.lon],
      body: `${event.participants} · ${event.found}`,
      href: event.href,
    },
  ];
});

/** Greenalaya Nepal's address: Hemja, Pokhara (the homepage map's house). */
const office: FieldMapSite = {
  id: "office",
  name: "Greenalaya Nepal",
  tag: "Hemja, Pokhara · Gandaki Province",
  category: "office",
  coords: [28.2805, 83.92927],
  body: "Our office, where field programmes are planned and records are curated.",
  href: "/contact",
};

export const fieldMapSites: FieldMapSite[] = [...events, office];
