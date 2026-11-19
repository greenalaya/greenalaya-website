/**
 * Generates public/maps/nepal-provinces.geojson: Nepal's seven provinces in latitude and
 * longitude, for the homepage's "Where We Work" map, which draws them over its street map.
 *
 * Source: the official post-May-2020 map of Nepal (including Kalapani, Lipulekh and Limpiyadhura),
 * from Nepal subnational administrative boundaries, HDX COD-AB (CC BY 4.0), as simplified in
 * nepali-geo-pro-max (MIT). The same pinned commit as scripts/build-nepal-map.mjs, so the
 * field map and the homepage map show the same boundary.
 *
 * Usage: node scripts/build-nepal-geojson.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "maps");
const outPath = path.join(outDir, "nepal-provinces.geojson");

const SOURCE_COMMIT = "117fd0f3d2dabae3bd86bfe9e4c57098ffe56669";
const sourceUrl = (file) =>
  `https://raw.githubusercontent.com/l3lackcurtains/nepali-geo-pro-max/${SOURCE_COMMIT}/src/geo/${file}`;

const PROVINCE_NAMES = {
  P1: "Koshi",
  P2: "Madhesh",
  P3: "Bagmati",
  P4: "Gandaki",
  P5: "Lumbini",
  P6: "Karnali",
  P7: "Sudurpashchim",
};

/** The source files are TypeScript modules exporting one GeoJSON object literal. */
async function loadGeo(file) {
  const response = await fetch(sourceUrl(file));
  if (!response.ok) throw new Error(`Could not download ${file}: HTTP ${response.status}`);
  const text = await response.text();
  return JSON.parse(text.slice(text.indexOf("= ") + 2, text.trimEnd().lastIndexOf(";")));
}

// Four decimal places is about 10 m: far finer than the map ever needs, and a small file.
const round = (value) => Math.round(value * 1e4) / 1e4;
const roundCoords = (coords) =>
  typeof coords[0] === "number" ? coords.map(round) : coords.map(roundCoords);

/** The outer rings of a Polygon or MultiPolygon (each province is stored district by district). */
const outerRings = (geometry) =>
  geometry.type === "Polygon"
    ? [geometry.coordinates[0]]
    : geometry.coordinates.map((polygon) => polygon[0]);

/**
 * Merges rings that share edges into the outline of the whole: an edge used by two rings lies
 * between them and is dropped; the edges left are chained back into closed rings.
 */
function dissolve(rings) {
  const key = ([lon, lat]) => `${lon},${lat}`;
  const edges = new Map();
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = key(ring[i]);
      const b = key(ring[i + 1]);
      if (a === b) continue;
      const id = a < b ? `${a}|${b}` : `${b}|${a}`;
      const entry = edges.get(id);
      if (entry) entry.count++;
      else edges.set(id, { a, b, count: 1 });
    }
  }
  const next = new Map();
  for (const { a, b, count } of edges.values()) {
    if (count !== 1) continue;
    if (!next.has(a)) next.set(a, []);
    if (!next.has(b)) next.set(b, []);
    next.get(a).push(b);
    next.get(b).push(a);
  }
  const used = new Set();
  const out = [];
  for (const start of next.keys()) {
    for (const first of next.get(start)) {
      const id = start < first ? `${start}|${first}` : `${first}|${start}`;
      if (used.has(id)) continue;
      used.add(id);
      const chain = [start, first];
      let previous = start;
      let current = first;
      while (current !== start) {
        const options = next.get(current).filter((point) => {
          const edge = current < point ? `${current}|${point}` : `${point}|${current}`;
          return !used.has(edge);
        });
        const step = options.find((point) => point !== previous) ?? options[0];
        if (!step) break;
        used.add(current < step ? `${current}|${step}` : `${step}|${current}`);
        chain.push(step);
        previous = current;
        current = step;
      }
      out.push(chain.map((point) => point.split(",").map(Number)));
    }
  }
  // Tiny gaps between neighbouring districts in the source leave a few small slivers; the
  // outline wanted is the one big ring (every province, and Nepal, is one piece of land).
  return [out.reduce((big, ring) => (ring.length > big.length ? ring : big), [])];
}

const provincesGeo = await loadGeo("provinces.geo.ts");

const provinces = provincesGeo.features.map((feature) => {
  const name = PROVINCE_NAMES[feature.properties.id];
  if (!name) throw new Error(`Unknown province id ${feature.properties.id}`);
  return { name, geometry: roundCoords(feature.geometry.coordinates), type: feature.geometry.type };
});

const features = [
  // Districts: each province's pieces, for the faint district lines and the province labels.
  ...provinces.map(({ name, type, geometry }) => ({
    type: "Feature",
    properties: { kind: "districts", name },
    geometry: { type, coordinates: geometry },
  })),
  // Province borders: the districts of each province merged into one outline.
  ...provinces.map(({ name, type, geometry }) => ({
    type: "Feature",
    properties: { kind: "province", name },
    geometry: {
      type: "MultiLineString",
      coordinates: dissolve(outerRings({ type, coordinates: geometry })),
    },
  })),
];

// Nepal's border: every district merged; also the hole cut in the fade over the neighbours.
const country = dissolve(
  provinces.flatMap(({ type, geometry }) => outerRings({ type, coordinates: geometry })),
);
features.push({
  type: "Feature",
  properties: { kind: "country", name: "Nepal" },
  geometry: { type: "MultiLineString", coordinates: country },
});

const geojson = {
  type: "FeatureCollection",
  attribution:
    "Official map of Nepal (2020). Boundaries: HDX COD-AB (CC BY 4.0) via nepali-geo-pro-max.",
  features,
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, JSON.stringify(geojson));
const ringSizes = country.map((ring) => ring.length).sort((a, b) => b - a);
console.log(
  `Wrote ${path.relative(process.cwd(), outPath)}: ${provinces.length} provinces; ` +
    `country border ${country.length} ring(s), sizes ${ringSizes.slice(0, 5).join(", ")}.`,
);
