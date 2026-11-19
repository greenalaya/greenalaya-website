"use client";

import { House, Minus, Plus, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { nepalDistricts } from "@/lib/content/nepal-districts";
import { mapAttribution, nepalMap } from "@/lib/content/nepal-map";
import { fieldEventSites } from "@/lib/content/field-event-sites";
import { workSites } from "@/lib/content/work-sites";
import { cn } from "@/lib/utils";
import {
  homeContainerClass,
  homeScreenClass,
  homeSectionBodyClass,
  homeSectionHeadingClass,
  homeSectionSpaceClass,
} from "@/components/home-preview/home-styles";

/** A point on the map: what its card says, and where it is. */
type Mark = {
  id: string;
  /** The card's lines; the first is its heading. */
  lines: string[];
  point: { x: number; y: number };
};

/** The field sites, with their place on the map. */
const fieldSites: Mark[] = fieldEventSites.flatMap((item) => {
  const place = workSites.find((site) => site.id === item.siteId);
  if (!place) return [];
  return [
    {
      id: item.siteId,
      lines: [item.event, item.location, item.participants, item.found],
      point: nepalMap.project(place.lon, place.lat),
    },
  ];
});

/** Greenalaya Nepal's address: Hemja, Pokhara (28.280500, 83.929270). */
const home: Mark = {
  id: "home",
  lines: ["Greenalaya Nepal", "Hemja, Pokhara", "Gandaki Province"],
  point: nepalMap.project(83.92927, 28.2805),
};

const marks = [...fieldSites, home];

/** A mark's name for screen readers: its card's first two lines. */
const nameOf = (mark: Mark) => mark.lines.slice(0, 2).join(": ");

/**
 * The field sites sit close together, so each mark's card hangs off it diagonally, in the
 * direction that has the fewest other marks: that way an open card never hides another mark.
 */
function cornerFor(mark: Mark) {
  const corners = [
    { below: false, right: true },
    { below: false, right: false },
    { below: true, right: true },
    { below: true, right: false },
  ];
  const others = marks.filter((other) => other.id !== mark.id);
  const covered = (corner: (typeof corners)[number]) =>
    others.filter(
      (other) =>
        other.point.x > mark.point.x === corner.right &&
        other.point.y > mark.point.y === corner.below,
    ).length;
  return corners.reduce((best, corner) => (covered(corner) < covered(best) ? corner : best));
}

/** Phones and tablets: how far the map can be zoomed, step by step. */
const ZOOMS = [1, 1.75, 2.5, 3.5];

const zoomButtonClass =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-home-ink/15 bg-home-ground/90 text-home-ink shadow-sm transition-colors duration-200 hover:bg-home-ground disabled:cursor-default disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action";

/** Runs `action` when Enter or Space is pressed on a map mark, as a button would. */
const onPress = (action: () => void) => (event: KeyboardEvent) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  action();
};

/** The details of the clicked mark, in a card that hangs off its point by one corner. */
function MarkCard({
  mark,
  onClose,
  className,
}: {
  mark: Mark;
  onClose: () => void;
  className?: string;
}) {
  const { below, right } = cornerFor(mark);
  const [heading, ...rest] = mark.lines;

  return (
    <div
      role="dialog"
      data-map-card
      aria-label={nameOf(mark)}
      style={{
        left: `${(mark.point.x / nepalMap.width) * 100}%`,
        top: `${(mark.point.y / nepalMap.height) * 100}%`,
      }}
      className={cn(
        "z-10 rounded-lg bg-home-ink py-3 pr-11 pl-4 text-home-ground shadow-lg",
        // On a phone the map is too small to hold the card, so it sits under the map instead.
        "max-sm:relative max-sm:inset-auto! max-sm:mt-3 sm:absolute sm:w-max sm:max-w-68",
        className,
        below ? "sm:translate-y-3" : "sm:-translate-y-[calc(100%+0.75rem)]",
        right ? "sm:translate-x-3" : "sm:-translate-x-[calc(100%+0.75rem)]",
        // The corner nearest the point is left square, so the card points at it.
        below
          ? right
            ? "sm:rounded-tl-none"
            : "sm:rounded-tr-none"
          : right
            ? "sm:rounded-bl-none"
            : "sm:rounded-br-none",
      )}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-1 right-1 inline-flex size-9 cursor-pointer items-center justify-center rounded-md opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-home-ground"
      >
        <X aria-hidden className="size-4" />
      </button>
      <p className="text-base leading-snug font-bold">{heading}</p>
      {rest.map((line) => (
        <p key={line} className="mt-1 text-sm leading-snug">
          {line}
        </p>
      ))}
    </div>
  );
}

/**
 * "Where we work" map: Nepal district by district, with a dot for each field site and a
 * house at our own address. Provinces light up as you point at them, and clicking a mark
 * opens its details in a card on the map. On a laptop the map is kept narrow enough for the
 * whole of it to fit on the screen at once. The boundaries' credit (their CC BY licence asks
 * for one) is the map's hover note and is read by screen readers; it is not shown as a line
 * under the map, so a visible credit belongs somewhere else on the site.
 *
 * `inScreen` (the homepage (/)): on a laptop the section is one screen and a snap point, like
 * the screens around it, and the map is sized to what the screen leaves under the heading.
 */
export function HomeWorkMap({ inScreen = false }: { inScreen?: boolean }) {
  const [province, setProvince] = useState<string | null>(null);
  // The mark whose details card is open on the map, if any.
  const [openId, setOpenId] = useState<string | null>(null);
  // Phones and tablets: the map's zoom (a step in ZOOMS); zoomed, a finger drags it sideways.
  const [zoomStep, setZoomStep] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const zoomTo = (next: number) => {
    const el = scroller.current;
    const from = ZOOMS[zoomStep];
    const to = ZOOMS[next];
    setZoomStep(next);
    if (!el) return;
    // Keep the middle of what is on screen in the middle.
    const centre = (el.scrollLeft + el.clientWidth / 2) / from;
    requestAnimationFrame(() => {
      el.scrollLeft = centre * to - el.clientWidth / 2;
    });
  };
  const open = marks.find((mark) => mark.id === openId);

  // Clicking a mark opens its card; clicking the same mark again closes it.
  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  // An open card also closes on Escape, and on a click anywhere that is not a mark or the card.
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest("[data-map-mark], [data-map-card]")) setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [openId]);

  return (
    <section
      id="where-we-work"
      aria-labelledby="where-title"
      className={cn(
        // The screens page alternates green and plain from the hero: the map's screen is green.
        // At least one screen rather than exactly one, so nothing spills into its neighbours.
        inScreen
          ? [
              "bg-home-field dark:bg-home-ground",
              homeScreenClass,
              "lg:h-auto lg:min-h-[calc(100svh-4.5rem)] lg:justify-center",
            ]
          : ["scroll-mt-24 border-t border-home-line", homeSectionSpaceClass],
      )}
    >
      <div className={homeContainerClass}>
        <h2
          id="where-title"
          // Phones and tablets: centred.
          className={`${homeSectionHeadingClass} text-home-ink max-lg:text-center`}
        >
          Where We Work
        </h2>

        <div
          className={cn(
            homeSectionBodyClass,
            // One screen on a laptop: the same gap under the heading as the screens around it.
            inScreen && "lg:mt-8 lg:short:mt-6",
            "relative",
            // Centred under the heading on a laptop.
            "lg:mx-auto",
            inScreen ? "lg:max-w-(--map-max)" : "lg:max-w-5xl",
          )}
          style={
            {
              // One screen: no taller than the screen allows once the header, the padding, the
              // heading and the gap under it are taken off (about 14rem in all).
              "--map-max": `calc((100svh - 14rem) * ${nepalMap.width / nepalMap.height})`,
            } as CSSProperties
          }
        >
          {/* Phones and tablets: zoom buttons over the map; zoomed, it scrolls sideways. */}
          <div className="relative">
            <div ref={scroller} className="max-lg:overflow-x-auto max-lg:overscroll-x-contain">
              <div className="relative lg:w-full!" style={{ width: `${ZOOMS[zoomStep] * 100}%` }}>
                <svg
                  viewBox={`0 0 ${nepalMap.width} ${nepalMap.height}`}
                  role="group"
                  aria-label="Map of Nepal with the places we have worked"
                  className="block h-auto w-full"
                >
                  {/* Shown on hover and read by screen readers. */}
                  <title>{mapAttribution}</title>
                  {nepalDistricts.map((district) => (
                    <path
                      key={district.name}
                      d={district.d}
                      className={cn(
                        // The site's map colours: land that stands clear of the page in both themes,
                        // and a stronger shade for the province being pointed at. The lines are ink:
                        // black in the light theme, white in the dark.
                        "stroke-home-ink transition-[fill] duration-300",
                        district.province === province ? "fill-map-shaded" : "fill-map-land",
                      )}
                      strokeWidth={1}
                      strokeLinejoin="round"
                      onMouseEnter={() => setProvince(district.province)}
                      onClick={() => setProvince(district.province)}
                    />
                  ))}
                  {/* Province borders, a little heavier than the district lines. */}
                  {nepalMap.provinces.map((item) => (
                    <path
                      key={item.name}
                      d={item.d}
                      className="pointer-events-none fill-none stroke-home-ink"
                      strokeWidth={2}
                      strokeLinejoin="round"
                    />
                  ))}
                  {/* The field sites, as dots. */}
                  {fieldSites.map((site) => {
                    const selected = openId === site.id;
                    return (
                      <circle
                        key={site.id}
                        cx={site.point.x}
                        cy={site.point.y}
                        // Ink on a ground-coloured ring: the strongest contrast against the land in
                        // both themes, whether or not its province is shaded.
                        r={selected ? 10 : 7}
                        className={cn(
                          "cursor-pointer fill-home-ink stroke-home-ground outline-none focus-visible:stroke-home-accent",
                        )}
                        strokeWidth={2.5}
                        role="button"
                        tabIndex={0}
                        aria-label={nameOf(site)}
                        data-map-mark
                        onClick={() => toggle(site.id)}
                        onKeyDown={onPress(() => toggle(site.id))}
                      />
                    );
                  })}
                  {/* Our own address, as a house. */}
                  <g
                    role="button"
                    tabIndex={0}
                    aria-label={nameOf(home)}
                    className="group cursor-pointer outline-none"
                    data-map-mark
                    onClick={() => toggle(home.id)}
                    onKeyDown={onPress(() => toggle(home.id))}
                  >
                    <circle
                      cx={home.point.x}
                      cy={home.point.y}
                      r={openId === home.id ? 16 : 14}
                      className="fill-home-ink stroke-home-ground group-focus-visible:stroke-home-accent"
                      strokeWidth={2.5}
                    />
                    <House
                      aria-hidden
                      x={home.point.x - 8}
                      y={home.point.y - 8}
                      width={16}
                      height={16}
                      strokeWidth={2.25}
                      className="pointer-events-none text-home-ground"
                    />
                  </g>
                </svg>
                {/* On the map from tablets up (it moves and grows with the zoom). */}
                {open ? (
                  <MarkCard mark={open} onClose={() => setOpenId(null)} className="max-sm:hidden" />
                ) : null}
              </div>
            </div>
            <div
              role="group"
              aria-label="Zoom the map"
              // Part of the map: using it leaves an open card open.
              data-map-card
              className="absolute right-2 bottom-2 flex gap-2 lg:hidden"
            >
              <button
                type="button"
                aria-label="Zoom out"
                disabled={zoomStep === 0}
                onClick={() => zoomTo(zoomStep - 1)}
                className={zoomButtonClass}
              >
                <Minus aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                disabled={zoomStep === ZOOMS.length - 1}
                onClick={() => zoomTo(zoomStep + 1)}
                className={zoomButtonClass}
              >
                <Plus aria-hidden className="size-5" />
              </button>
            </div>
          </div>
          {/* Phones: under the map, where it has room. */}
          {open ? (
            <MarkCard mark={open} onClose={() => setOpenId(null)} className="sm:hidden" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
