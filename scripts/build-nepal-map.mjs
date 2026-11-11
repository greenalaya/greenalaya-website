/**
 * Generates lib/content/nepal-map.ts: SVG outlines of Nepal's provinces and the Kathmandu Valley
 * districts for the "Where we work" map.
 *
 * Source: the official post-May-2020 map of Nepal (including Kalapani, Lipulekh and Limpiyadhura),
 * from Nepal subnational administrative boundaries, HDX COD-AB (CC BY 4.0), as simplified in
 * nepali-geo-pro-max (MIT). The download is pinned to one commit so the output is reproducible.
 *
 * Usage: node scripts/build-nepal-map.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "lib", "content", "nepal-map.ts");

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
const VALLEY_DISTRICTS = ["Kathmandu", "Lalitpur", "Bhaktapur"];
const LAT0 = 28.4;
const COS0 = Math.cos((LAT0 * Math.PI) / 180);

/** The source files are TypeScript modules exporting one GeoJSON object literal. */
async function loadGeo(file) {
  const response = await fetch(sourceUrl(file));
  if (!response.ok) throw new Error(`Could not download ${file}: HTTP ${response.status}`);
  const text = await response.text();
  return JSON.parse(text.slice(text.indexOf("= ") + 2, text.trimEnd().lastIndexOf(";")));
}

const rings = (geometry) =>
  geometry.type === "Polygon"
    ? geometry.coordinates
    : geometry.type === "MultiPolygon"
      ? geometry.coordinates.flat()
      : [];

function bounds(features) {
  const lons = [];
  const lats = [];
  for (const feature of features)
    for (const ring of rings(feature.geometry))
      for (const [lon, lat] of ring) {
        lons.push(lon);
        lats.push(lat);
      }
  return [Math.min(...lons), Math.min(...lats), Math.max(...lons), Math.max(...lats)];
}

function makeProjection([minLon, minLat, maxLon, maxLat], width) {
  const k = width / ((maxLon - minLon) * COS0);
  return {
    project: (lon, lat) => [(lon - minLon) * COS0 * k, (maxLat - lat) * k],
    width,
    height: (maxLat - minLat) * k,
    params: { minLon, maxLat, k },
  };
}

function toPath(geometry, project, minStep) {
  let d = "";
  for (const ring of rings(geometry)) {
    const points = [];
    for (const [lon, lat] of ring) {
      const [x, y] = project(lon, lat);
      const last = points.at(-1);
      if (last && Math.hypot(x - last[0], y - last[1]) < minStep) continue;
      points.push([x, y]);
    }
    if (points.length < 3) continue;
    d += `M${points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L")}Z`;
  }
  return d;
}

const round = (value, digits) => Number(value.toFixed(digits));
const roundParams = (params) =>
  Object.fromEntries(Object.entries(params).map(([key, value]) => [key, round(value, 6)]));

const provincesGeo = await loadGeo("provinces.geo.ts");
const districtsGeo = await loadGeo("districts.geo.ts");

const main = makeProjection(bounds(provincesGeo.features), 1000);
const provinces = provincesGeo.features.map((feature) => {
  const name = PROVINCE_NAMES[feature.properties.id];
  if (!name) throw new Error(`Unknown province id ${feature.properties.id}`);
  return { name, d: toPath(feature.geometry, main.project, 1.2) };
});

const valleyFeatures = districtsGeo.features.filter((feature) =>
  VALLEY_DISTRICTS.includes(feature.properties.nameEn),
);
const [minLon, minLat, maxLon, maxLat] = bounds(valleyFeatures);
const pad = 0.02;
const valleyBox = [minLon - pad, minLat - pad, maxLon + pad, maxLat + pad];
const valley = makeProjection(valleyBox, 600);
const districts = valleyFeatures.map((feature) => ({
  name: feature.properties.nameEn,
  d: toPath(feature.geometry, valley.project, 0.6),
}));

const json = (value) => JSON.stringify(value);

const output = `/**
 * Nepal outlines for the "Where we work" map: the official post-May-2020 map of Nepal,
 * including Kalapani, Lipulekh and Limpiyadhura in Darchula district.
 * Source: Nepal subnational administrative boundaries, HDX COD-AB (CC BY 4.0), simplified in
 * nepali-geo-pro-max (MIT, https://github.com/l3lackcurtains/nepali-geo-pro-max).
 * Coordinates use an equirectangular projection centred on ${LAT0}°N. Do not edit by hand;
 * regenerate with \`node scripts/build-nepal-map.mjs\`.
 */

type Projection = { minLon: number; maxLat: number; k: number };

const COS_LAT0 = Math.cos((${LAT0} * Math.PI) / 180);

function projector(params: Projection) {
  // Rounded so server and browser render identical numbers (avoids hydration mismatches).
  const round = (value: number) => Math.round(value * 100) / 100;
  return (lon: number, lat: number) => ({
    x: round((lon - params.minLon) * COS_LAT0 * params.k),
    y: round((params.maxLat - lat) * params.k),
  });
}

export const nepalMap = {
  width: ${main.width.toFixed(1)},
  height: ${main.height.toFixed(1)},
  provinces: ${json(provinces)} as { name: string; d: string }[],
  project: projector(${json(roundParams(main.params))}),
};

export const kathmanduValleyMap = {
  width: ${valley.width.toFixed(1)},
  height: ${valley.height.toFixed(1)},
  districts: ${json(districts)} as { name: string; d: string }[],
  project: projector(${json(roundParams(valley.params))}),
  /** Bounding box of the inset, used to decide which sites appear in it. */
  bounds: ${json({ minLon: round(valleyBox[0], 4), minLat: round(valleyBox[1], 4), maxLon: round(valleyBox[2], 4), maxLat: round(valleyBox[3], 4) })},
};

export const mapAttribution =
  "Official map of Nepal (2020). Boundaries: HDX COD-AB (CC BY 4.0) via nepali-geo-pro-max.";
`;

writeFileSync(outPath, output);
console.log(
  `Wrote ${path.relative(process.cwd(), outPath)}: ${provinces.length} provinces, ${districts.length} valley districts.`,
);
