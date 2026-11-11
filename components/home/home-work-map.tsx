"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { kathmanduValleyMap, mapAttribution, nepalMap } from "@/lib/content/nepal-map";
import {
  districtProjects,
  provinceProjects,
  workSites,
  workThemes,
  type WorkTheme,
} from "@/lib/content/work-sites";
import { cn } from "@/lib/utils";
import {
  homeArrowIconClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";

type Filter = "all" | WorkTheme;
type Selection =
  | { type: "site"; id: string }
  | { type: "district"; id: string }
  | { type: "province"; id: string };

type DetailItem = {
  title: string;
  date: string;
  partners: string[];
  href: string;
};

const valley = kathmanduValleyMap.bounds;
const inValley = (lat: number, lon: number) =>
  lat >= valley.minLat && lat <= valley.maxLat && lon >= valley.minLon && lon <= valley.maxLon;

const percent = (value: number, total: number) => `${((value / total) * 100).toFixed(2)}%`;

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action";

/** Stretches a small label's tap area past 24px (WCAG 2.5.8) without changing how it looks. */
const tapAreaClass = "after:absolute after:-inset-x-1 after:-inset-y-1.5 after:content-['']";

function Pin({
  label,
  kind,
  selected,
  left,
  top,
  onSelect,
}: {
  label: string;
  kind: "site" | "base";
  selected: boolean;
  left: string;
  top: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      style={{ left, top }}
      className={cn(
        "absolute z-10 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "block border-2 border-home-ground transition-transform duration-200",
          kind === "base"
            ? "size-3.5 rotate-45 bg-home-ink"
            : "size-3.5 rounded-full bg-home-accent",
          selected && "scale-150",
        )}
      />
    </button>
  );
}

/**
 * "Where we work" map: places, district- and province-wide projects, with a list view.
 *
 * `inScreen` (/home-preview-2): on a laptop the section fills one screen (under the fixed
 * header), like the screens around it. It is pared down: the heading and filters share one
 * band, with no description, no "All places" list (every place is a button on the map) and
 * only a short map credit (the boundaries' CC BY licence asks for one) at the end of the
 * legend. The map is sized to the screen's height, and the place details scroll within their
 * column if a place has more events than fit. Phones and tablets keep the normal flow.
 */
export function HomeWorkMap({ inScreen = false }: { inScreen?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selection, setSelection] = useState<Selection>({ type: "site", id: "godawari" });

  const matches = (theme: WorkTheme) => filter === "all" || filter === theme;

  /** Change the theme filter; if the selected place no longer matches, select the first one that does. */
  const changeFilter = (next: Filter) => {
    setFilter(next);
    const fits = (theme: WorkTheme) => next === "all" || next === theme;
    const stillVisible =
      selection.type === "site"
        ? workSites.some(
            (site) =>
              site.id === selection.id &&
              (site.kind === "base" || site.activities.some((activity) => fits(activity.theme))),
          )
        : selection.type === "district"
          ? districtProjects.some((item) => item.district === selection.id && fits(item.theme))
          : provinceProjects.some((item) => item.province === selection.id && fits(item.theme));
    if (stillVisible) return;
    const firstSite = workSites.find(
      (site) => site.kind === "site" && site.activities.some((activity) => fits(activity.theme)),
    );
    if (firstSite) setSelection({ type: "site", id: firstSite.id });
  };
  const sites = workSites.filter(
    (site) => site.kind === "base" || site.activities.some((activity) => matches(activity.theme)),
  );
  const districts = districtProjects.filter((item) => matches(item.theme));
  const provinces = provinceProjects.filter((item) => matches(item.theme));

  const shadedProvinces = new Set(provinces.map((item) => item.province));
  const shadedDistricts = new Set(districts.map((item) => item.district));

  // Resolve the selected item into a heading, a place line and a list of activities.
  let detail: { heading: string; place: string; items: DetailItem[]; note?: string } | null = null;
  if (selection.type === "site") {
    const site = sites.find((item) => item.id === selection.id);
    if (site) {
      detail = {
        heading: site.name,
        place: `${site.district} district, ${site.province} Province`,
        items: site.activities.filter((activity) => matches(activity.theme)),
        note: site.kind === "base" ? "Greenalaya Nepal is based in Pokhara." : undefined,
      };
    }
  } else if (selection.type === "district") {
    const item = districts.find((district) => district.district === selection.id);
    if (item) {
      detail = {
        heading: `${item.district} district`,
        place: `${item.locations} documented locations, Bagmati Province`,
        items: [{ title: item.title, date: item.date, partners: item.partners, href: item.href }],
      };
    }
  } else {
    const item = provinces.find((province) => province.province === selection.id);
    if (item) {
      detail = {
        heading: `${item.province} Province`,
        place: "Province-wide citizen science",
        items: [{ title: item.title, date: item.status, partners: [], href: item.href }],
      };
    }
  }

  const valleySites = sites.filter((site) => inValley(site.lat, site.lon));
  const mainSites = sites.filter((site) => !inValley(site.lat, site.lon));
  const isSelected = (type: Selection["type"], id: string) =>
    selection.type === type && selection.id === id;

  const valleyCorner = nepalMap.project(valley.minLon, valley.maxLat);
  const valleyFar = nepalMap.project(valley.maxLon, valley.minLat);

  return (
    <section
      id="where-we-work"
      aria-labelledby="where-title"
      className={cn(
        "scroll-mt-24 py-20 md:py-28",
        // In one screen, a jump to this section (the hero's button) lands it exactly under
        // the 4.8rem header, so the whole screen shows.
        inScreen &&
          "lg:flex lg:min-h-[calc(100svh-4.8rem)] lg:scroll-mt-[4.8rem] lg:flex-col lg:justify-center lg:py-8",
      )}
    >
      <div className={cn(homeContainerClass, inScreen && "lg:w-full")}>
        <div
          className={cn(inScreen && "flex flex-wrap items-center justify-between gap-x-10 gap-y-6")}
        >
          <div>
            <h2 id="where-title" className={`${homeSectionHeadingClass} text-home-ink`}>
              Where We Work
            </h2>
            {inScreen ? null : (
              <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-home-ink">
                The places we have run field surveys and citizen-science programs. Select a place to
                see what happened there.
              </p>
            )}
          </div>

          <div
            role="group"
            aria-label="Filter places by theme"
            className={cn("flex flex-wrap gap-2", inScreen ? "shrink-0" : "mt-6")}
          >
            {[{ id: "all" as Filter, label: "All work" }, ...workThemes].map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={filter === option.id}
                onClick={() => changeFilter(option.id)}
                className={cn(
                  "min-h-10 cursor-pointer rounded-md px-4 text-sm font-semibold transition-colors duration-200",
                  focusRing,
                  filter === option.id
                    ? "bg-home-accent text-home-ground"
                    : "bg-home-field text-home-ink hover:bg-home-field/70",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            {/* Nepal */}
            <div
              className={cn("relative w-full", inScreen && "lg:max-w-(--map-max)")}
              style={
                {
                  aspectRatio: `${nepalMap.width} / ${nepalMap.height}`,
                  // Full screen: no taller than the screen allows once the header, the
                  // heading band, the gaps and the legend are taken off (about 16rem in all).
                  "--map-max": `calc((100svh - 16rem) * ${nepalMap.width / nepalMap.height})`,
                } as CSSProperties
              }
            >
              <svg
                viewBox={`0 0 ${nepalMap.width} ${nepalMap.height}`}
                className="absolute inset-0 size-full"
                role="img"
                aria-label="Map of Nepal's seven provinces with the places we have worked"
              >
                {nepalMap.provinces.map((province) => (
                  <path
                    key={province.name}
                    d={province.d}
                    className={cn(
                      "stroke-home-ground transition-colors duration-200",
                      shadedProvinces.has(province.name) ? "fill-map-shaded" : "fill-map-land",
                    )}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  >
                    <title>{`${province.name} Province`}</title>
                  </path>
                ))}
                <rect
                  x={valleyCorner.x}
                  y={valleyCorner.y}
                  width={Math.round((valleyFar.x - valleyCorner.x) * 100) / 100}
                  height={Math.round((valleyFar.y - valleyCorner.y) * 100) / 100}
                  className="fill-none stroke-home-ink"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              </svg>
              {mainSites.map((site) => {
                const point = nepalMap.project(site.lon, site.lat);
                return (
                  <Pin
                    key={site.id}
                    label={`${site.name}, ${site.district}`}
                    kind={site.kind}
                    selected={isSelected("site", site.id)}
                    left={percent(point.x, nepalMap.width)}
                    top={percent(point.y, nepalMap.height)}
                    onSelect={() => setSelection({ type: "site", id: site.id })}
                  />
                );
              })}
              {provinces.map((item) => {
                const anchor = nepalMap.project(85.1, 27.95);
                return (
                  <button
                    key={item.province}
                    type="button"
                    aria-label={`Moths project: ${item.province} Province`}
                    aria-pressed={isSelected("province", item.province)}
                    onClick={() => setSelection({ type: "province", id: item.province })}
                    style={{
                      left: percent(anchor.x, nepalMap.width),
                      top: percent(anchor.y, nepalMap.height),
                    }}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm bg-home-ground/90 px-1.5 py-0.5 text-sm font-semibold whitespace-nowrap text-home-ink",
                      tapAreaClass,
                      focusRing,
                    )}
                  >
                    Moths project
                  </button>
                );
              })}
            </div>

            {/* Kathmandu Valley inset */}
            <div className="mt-4 ml-auto w-[56%] max-w-[15rem] rounded-lg border border-home-ink/15 bg-home-ground p-2 sm:absolute sm:top-0 sm:right-0 sm:mt-0 sm:w-[23%] sm:max-w-none">
              <p className="px-1 pb-1 text-sm font-semibold text-home-ink">Kathmandu Valley</p>
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${kathmanduValleyMap.width} / ${kathmanduValleyMap.height}`,
                }}
              >
                <svg
                  viewBox={`0 0 ${kathmanduValleyMap.width} ${kathmanduValleyMap.height}`}
                  className="absolute inset-0 size-full"
                  role="img"
                  aria-label="Kathmandu, Lalitpur and Bhaktapur districts"
                >
                  {kathmanduValleyMap.districts.map((district) => (
                    <path
                      key={district.name}
                      d={district.d}
                      className={cn(
                        "stroke-home-ground",
                        shadedDistricts.has(district.name) ? "fill-map-shaded" : "fill-map-land",
                      )}
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      <title>{`${district.name} district`}</title>
                    </path>
                  ))}
                </svg>
                {districts.map((item) => {
                  const point = kathmanduValleyMap.project(item.lon, item.lat);
                  return (
                    <button
                      key={item.district}
                      type="button"
                      aria-label={`${item.district} district: ${item.locations} documented locations`}
                      aria-pressed={isSelected("district", item.district)}
                      onClick={() => setSelection({ type: "district", id: item.district })}
                      style={{
                        left: percent(point.x, kathmanduValleyMap.width),
                        top: percent(point.y, kathmanduValleyMap.height),
                      }}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm px-1 text-sm leading-tight font-semibold whitespace-nowrap text-home-ink",
                        tapAreaClass,
                        isSelected("district", item.district)
                          ? "bg-home-ground"
                          : "bg-home-ground/70",
                        focusRing,
                      )}
                    >
                      {item.district} · {item.locations}
                    </button>
                  );
                })}
                {valleySites.map((site) => {
                  const point = kathmanduValleyMap.project(site.lon, site.lat);
                  return (
                    <Pin
                      key={site.id}
                      label={`${site.name}, ${site.district}`}
                      kind={site.kind}
                      selected={isSelected("site", site.id)}
                      left={percent(point.x, kathmanduValleyMap.width)}
                      top={percent(point.y, kathmanduValleyMap.height)}
                      onSelect={() => setSelection({ type: "site", id: site.id })}
                    />
                  );
                })}
              </div>
            </div>

            <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-home-ink">
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-3 rounded-full border-2 border-home-ground bg-home-accent"
                />
                Program site
              </li>
              <li className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-3 rotate-45 border-2 border-home-ground bg-home-ink"
                />
                Our base
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden className="h-3 w-5 rounded-sm bg-map-shaded" />
                District- or province-wide project
              </li>
              {inScreen ? (
                // The boundaries' licence (CC BY 4.0) asks for a visible credit; kept short.
                <li className="text-sm text-home-muted lg:ml-auto">Map: HDX COD-AB (CC BY 4.0)</li>
              ) : null}
            </ul>
          </div>

          <div className={cn("lg:col-span-4", inScreen && "lg:relative")}>
            {/* Full screen: the column is exactly as tall as the map's, and the details
                scroll within it if they're longer. */}
            <div className={cn(inScreen && "lg:absolute lg:inset-0 lg:flex lg:flex-col")}>
              <div className={cn(inScreen && "lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1")}>
                <p aria-live="polite" className="sr-only">
                  {detail ? `Showing ${detail.heading}` : ""}
                </p>
                <div className="rounded-lg bg-home-field p-5 sm:p-6">
                  {detail ? (
                    <>
                      <h3 className="text-xl leading-tight font-bold text-home-ink">
                        {detail.heading}
                      </h3>
                      <p className="mt-1 text-sm text-home-ink">{detail.place}</p>
                      {detail.note ? (
                        <p className="mt-3 text-sm leading-relaxed text-home-ink">{detail.note}</p>
                      ) : null}
                      <ul className="mt-4 space-y-4">
                        {detail.items.map((item) => (
                          <li key={`${item.title}-${item.date}`}>
                            <p className="text-sm font-semibold text-home-accent">{item.date}</p>
                            <p className="mt-0.5 font-semibold text-home-ink">{item.title}</p>
                            {item.partners.length > 0 ? (
                              <p className="mt-0.5 text-sm text-home-ink">
                                With {item.partners.join(", ")}
                              </p>
                            ) : null}
                            <Link
                              href={item.href}
                              className={cn(
                                "group/link relative mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-home-accent no-underline",
                                tapAreaClass,
                                focusRing,
                              )}
                            >
                              Read more
                              <ArrowRight aria-hidden className={homeArrowIconClass} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm text-home-ink">
                      {inScreen
                        ? "Select a place on the map."
                        : "Select a place on the map or in the list."}
                    </p>
                  )}
                </div>

                {/* The full list: another way to reach every place; collapsed to keep the page
                    short. Left out of the pared-down full-screen version. */}
                {inScreen ? null : (
                  <details className="group/places mt-6">
                    <summary
                      className={cn(
                        "flex min-h-11 cursor-pointer list-none items-center justify-between rounded-md text-sm font-semibold text-home-accent [&::-webkit-details-marker]:hidden",
                        focusRing,
                      )}
                    >
                      All places ({sites.length + districts.length + provinces.length})
                      <ChevronDown
                        aria-hidden
                        className="size-4 transition-transform duration-200 group-open/places:rotate-180"
                      />
                    </summary>
                    <ul className="mt-1 space-y-1">
                      {[
                        ...sites.map((site) => ({
                          key: `site-${site.id}`,
                          label: site.name,
                          meta: site.kind === "base" ? "Our base" : `${site.district}`,
                          select: { type: "site", id: site.id } as Selection,
                        })),
                        ...districts.map((item) => ({
                          key: `district-${item.district}`,
                          label: `${item.district} district`,
                          meta: `${item.locations} locations`,
                          select: { type: "district", id: item.district } as Selection,
                        })),
                        ...provinces.map((item) => ({
                          key: `province-${item.province}`,
                          label: `${item.province} Province`,
                          meta: "Moths project",
                          select: { type: "province", id: item.province } as Selection,
                        })),
                      ].map((row) => (
                        <li key={row.key}>
                          <button
                            type="button"
                            aria-pressed={isSelected(row.select.type, row.select.id)}
                            onClick={() => setSelection(row.select)}
                            className={cn(
                              "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm text-home-ink transition-colors duration-200 hover:bg-home-field",
                              focusRing,
                              isSelected(row.select.type, row.select.id) &&
                                "bg-home-field font-semibold",
                            )}
                          >
                            <span>{row.label}</span>
                            <span className="text-sm text-home-muted">{row.meta}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              {inScreen ? null : (
                <p className="mt-4 shrink-0 text-sm leading-relaxed text-home-muted">
                  Locations are approximate and shown for orientation. {mapAttribution}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
