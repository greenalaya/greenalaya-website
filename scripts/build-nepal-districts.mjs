/**
 * Generates lib/content/nepal-districts.ts: SVG outlines of Nepal's 77 districts, drawn in the
 * same coordinates as the provinces in lib/content/nepal-map.ts, for maps that colour or select
 * single districts (the "Where We Work" map).
 *
 * Source and projection are the same as scripts/build-nepal-map.mjs: Nepal subnational
 * administrative boundaries, HDX COD-AB (CC BY 4.0), as simplified in nepali-geo-pro-max (MIT),
 * pinned to one commit so the output is reproducible.
 *
 * Usage: node scripts/build-nepal-districts.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "..", "lib", "content", "nepal-districts.ts");

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
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const feature of features)
    for (const ring of rings(feature.geometry))
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon);
        minLat = Math.min(minLat, lat);
        maxLon = Math.max(maxLon, lon);
        maxLat = Math.max(maxLat, lat);
      }
  return [minLon, minLat, maxLon, maxLat];
}

const provincesGeo = await loadGeo("provinces.geo.ts");
const districtsGeo = await loadGeo("districts.geo.ts");

if (process.argv.includes("--inspect")) {
  console.log(JSON.stringify(districtsGeo.features[0].properties));
  console.log(districtsGeo.features.length, "districts");
  process.exit(0);
}

// The same projection as the province map: its bounds come from the province outlines.
const [minLon, , maxLon, maxLat] = bounds(provincesGeo.features);
const k = 1000 / ((maxLon - minLon) * COS0);
const project = (lon, lat) => [(lon - minLon) * COS0 * k, (maxLat - lat) * k];

function toPath(geometry, minStep) {
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

const districts = districtsGeo.features
  .map((feature) => {
    const properties = feature.properties;
    const province = PROVINCE_NAMES[properties.provinceId ?? properties.province ?? properties.pid];
    if (!province) throw new Error(`No province for ${JSON.stringify(properties)}`);
    return { name: properties.nameEn, province, d: toPath(feature.geometry, 1.4) };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const output = `/**
 * Outlines of Nepal's ${districts.length} districts, in the same coordinates as the provinces in
 * nepal-map.ts (use nepalMap.width, .height and .project with them).
 * Source: Nepal subnational administrative boundaries, HDX COD-AB (CC BY 4.0), simplified in
 * nepali-geo-pro-max (MIT, https://github.com/l3lackcurtains/nepali-geo-pro-max).
 * Do not edit by hand; regenerate with \`node scripts/build-nepal-districts.mjs\`.
 */
export const nepalDistricts: { name: string; province: string; d: string }[] = ${JSON.stringify(districts)};
`;

writeFileSync(outPath, output);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}: ${districts.length} districts.`);
