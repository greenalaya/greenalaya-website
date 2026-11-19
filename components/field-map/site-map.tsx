"use client";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useTheme } from "@teispace/next-themes";
import type { Layer, Map as LeafletMap, TileLayer } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** One marker on the map. `category` is a key of the map's `colours`. */
export type SiteMapSite = {
  id: string;
  name: string;
  /** The small line above the name: where it is. */
  tag: string;
  category: string;
  coords: [number, number];
  body: string;
  href?: string;
};

type Tiles = { url: string; attribution: string; maxNativeZoom: number };

const esriDarkStreets = (layer: "Base" | "Reference") =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_${layer}/MapServer/tile/{z}/{y}/{x}`;

/**
 * The background, drawn from bottom to top: OpenStreetMap in the light theme and, as it has no
 * dark version, Esri's dark street map (with its place names on top) in the dark theme.
 * Nepal's official 2020 border is drawn over both. Street maps still draw the pre-2020 border,
 * with Kalapani, Lipulekh and Limpiyadhura outside Nepal, so their old line can show faintly
 * in that corner.
 */
const background: Record<"light" | "dark", Tiles[]> = {
  light: [
    {
      url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxNativeZoom: 18,
    },
  ],
  dark: [
    { url: esriDarkStreets("Base"), attribution: "Map &copy; Esri", maxNativeZoom: 16 },
    { url: esriDarkStreets("Reference"), attribution: "", maxNativeZoom: 16 },
  ],
};

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!,
  );

/** A marker's popup: the tag, the name, a summary and a link to the full story. */
function popupHtml(site: SiteMapSite) {
  const link = site.href
    ? `<a class="fm-pop-link" href="${escape(site.href)}">${
        site.category === "office" ? "Get in touch" : "Read more"
      } &rarr;</a>`
    : "";
  return `<span class="fm-pop-tag">${escape(site.tag)}</span><p class="fm-pop-title">${escape(
    site.name,
  )}</p><p class="fm-pop-body">${escape(site.body)}</p>${link}`;
}

/**
 * An interactive street map of Nepal with a marker for each site, used by the homepage's
 * "Where We Work" section (components/home/home-work-map.tsx), in the site's light or dark
 * theme, with Nepal's official 2020 boundary drawn over it. Nearby markers gather into a
 * numbered cluster that opens as you zoom in; a marker's popup says what was done there;
 * `colours` gives each category's marker colour. The wheel only zooms the map after it has
 * been clicked, so scrolling the page past it never gets stuck.
 */
export function SiteMap({
  sites,
  colours,
  label,
  mapClassName = "h-110 md:h-145",
}: {
  sites: SiteMapSite[];
  colours: Record<string, string>;
  /** What the map shows, for screen readers. */
  label: string;
  /** The map's height (default: 27.5rem on phones, 36.25rem from tablets up). */
  mapClassName?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const tilesRef = useRef<TileLayer[]>([]);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();

  // The background in the site's light or dark theme (the lines and labels over it follow by
  // CSS).
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!ready || !map || !L) return;
    for (const layer of tilesRef.current) layer.remove();
    tilesRef.current = background[resolvedTheme === "dark" ? "dark" : "light"].map((tiles) =>
      L.tileLayer(tiles.url, {
        attribution: tiles.attribution,
        maxNativeZoom: tiles.maxNativeZoom,
        maxZoom: 18,
      }).addTo(map),
    );
  }, [ready, resolvedTheme]);

  useEffect(() => {
    let map: LeafletMap | null = null;
    let cancelled = false;

    (async () => {
      // Leaflet needs the browser's window, so it is loaded here rather than at the top.
      const L = (await import("leaflet")).default;
      // The plugin adds markerClusterGroup to the Leaflet object it finds on window.
      (window as unknown as { L: typeof L }).L = L;
      await import("leaflet.markercluster");
      if (cancelled || !container.current) return;

      map = L.map(container.current, {
        scrollWheelZoom: false,
        minZoom: 5,
        // Whole zoom levels only: in between, Leaflet resizes the tiles and hairline gaps show
        // between them.
        zoomSnap: 1,
        zoomDelta: 1,
      });
      // Nepal's corners, so the map opens on the whole country and the button below returns to it.
      const nepal: [[number, number], [number, number]] = [
        [26.3, 80.0],
        [30.5, 88.3],
      ];
      map.fitBounds(nepal, { padding: [10, 10] });

      // "Fit to Nepal": under the + and − buttons, in the same style.
      const FitControl = L.Control.extend({
        onAdd() {
          const bar = L.DomUtil.create("div", "leaflet-bar leaflet-control");
          const button = L.DomUtil.create("a", "fm-fit", bar);
          button.href = "#";
          button.role = "button";
          button.title = "Fit to Nepal";
          button.setAttribute("aria-label", "Fit to Nepal");
          button.innerHTML =
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
          L.DomEvent.disableClickPropagation(bar);
          L.DomEvent.on(button, "click", (event) => {
            L.DomEvent.preventDefault(event);
            map?.closePopup();
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              map?.fitBounds(nepal, { padding: [10, 10] });
            } else {
              map?.flyToBounds(nepal, { padding: [10, 10], duration: 0.8 });
            }
          });
          return bar;
        },
      });
      new FitControl({ position: "topleft" }).addTo(map);

      // Scroll-to-zoom only once the map is in use.
      map.on("click focus", () => map?.scrollWheelZoom.enable());
      map.on("mouseout blur", () => map?.scrollWheelZoom.disable());

      // The background tiles are added by the effect above, once the map exists.
      mapRef.current = map;
      leafletRef.current = L;
      setReady(true);

      // Nepal's official map (2020), generated by scripts/build-nepal-geojson.mjs.
      try {
        const response = await fetch("/maps/nepal-provinces.geojson");
        const nepalGeo = (await response.json()) as GeoJSON.FeatureCollection<
          GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.MultiLineString,
          { kind: "districts" | "province" | "country"; name: string }
        >;
        if (cancelled || !map) return;
        map.attributionControl.addAttribution(
          "Boundaries: official map of Nepal (2020), HDX COD-AB (CC BY 4.0)",
        );
        // Province names sit under the markers (Leaflet puts labels above them by default), so
        // a name never hides a marker or a cluster's count.
        map.createPane("fm-labels").style.zIndex = "450";
        const ofKind = (kind: "districts" | "province" | "country") => ({
          ...nepalGeo,
          features: nepalGeo.features.filter((feature) => feature.properties.kind === kind),
        });

        // Faint district lines, then province borders, then Nepal's border on top. Their colours
        // come from globals.css (.fm-line-*), so they change with the light and dark themes.
        L.geoJSON(ofKind("districts"), {
          interactive: false,
          style: { className: "fm-line-district", weight: 0.5, fill: false },
          // Each province's name, in the middle of it.
          onEachFeature: (feature, layer) => {
            const bounds = (
              layer as unknown as { getBounds: () => import("leaflet").LatLngBounds }
            ).getBounds();
            L.tooltip({
              permanent: true,
              direction: "center",
              className: "fm-province",
              interactive: false,
              pane: "fm-labels",
            })
              .setLatLng(bounds.getCenter())
              .setContent(feature.properties.name)
              .addTo(map!);
          },
        }).addTo(map);
        L.geoJSON(ofKind("province"), {
          interactive: false,
          style: { className: "fm-line-province", weight: 1 },
        }).addTo(map);
        L.geoJSON(ofKind("country"), {
          interactive: false,
          style: { className: "fm-line-country", weight: 1.75 },
        }).addTo(map);
      } catch {
        // Without the boundary file the map still works, on the street map alone.
      }

      const group = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 38,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: (cluster) =>
          L.divIcon({
            html: `<div class="fm-cluster"><span>${cluster.getChildCount()}</span></div>`,
            className: "",
            iconSize: [40, 40],
          }),
      });
      group.addTo(map);

      for (const site of sites) {
        const colour = colours[site.category] ?? "#183d32";
        const office = site.category === "office";
        const marker = L.marker(site.coords, {
          // Its name and place, e.g. "Pollinator Week 2026: Forestry Complex, Hetauda", so two
          // events of the same name can be told apart (hover note and screen readers).
          title: `${site.name}: ${site.tag}`,
          alt: `${site.name}: ${site.tag}`,
          icon: L.divIcon({
            className: "",
            html: `<span class="fm-marker${office ? " fm-marker-office" : ""}" style="background:${colour}"></span>`,
            iconSize: office ? [24, 24] : [18, 18],
            iconAnchor: office ? [12, 12] : [9, 9],
          }),
        });
        marker.bindPopup(popupHtml(site), { maxWidth: 300 });
        group.addLayer(marker as unknown as Layer);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
      mapRef.current = null;
      tilesRef.current = [];
      setReady(false);
    };
    // The sites are fixed for a page; the map is built once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden rounded-[20px] border border-home-line bg-home-surface shadow-[0_2px_4px_rgb(24_61_50/0.08),0_18px_40px_rgb(24_61_50/0.16)]">
      <div
        ref={container}
        role="region"
        aria-label={`${label} Click the map to zoom with the scroll wheel.`}
        className={cn("field-map relative z-0 w-full bg-[#e9e7e2] dark:bg-[#2b2b2b]", mapClassName)}
      />
    </div>
  );
}
