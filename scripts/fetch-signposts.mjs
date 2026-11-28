// Fetches the trail signposts (OSM guideposts) in the Tatras and writes them to
// src/data/signposts.geojson. Run by hand with `npm run data:signposts` and
// commit the result; it is not part of the build or CI (Overpass is unreliable).
// Data © OpenStreetMap contributors, ODbL.
import { mkdir, writeFile } from "node:fs/promises";

const OUTPUT = new URL("../src/data/signposts.geojson", import.meta.url);
// Public Overpass servers are often overloaded (502/504/429), so try mirrors
// in turn.
const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
];
const TIMEOUT_MS = 90_000;
// south, west, north, east
const BBOX = [49.05, 19.6, 49.35, 20.4];
const QUERY = `[out:json][timeout:60];node["information"="guidepost"]["name"](${BBOX.join(",")});out;`;
// Posts with the same name closer than this are one signpost location.
const DUPLICATE_METRES = 300;

function distanceMetres(a, b) {
  const lat = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dx = (a.lon - b.lon) * 111320 * Math.cos(lat);
  const dy = (a.lat - b.lat) * 110540;
  return Math.hypot(dx, dy);
}

function isHikingPost(tags) {
  if (tags.operator === "Unofficial") return false;
  return !(tags.bicycle === "yes" && tags.hiking !== "yes");
}

function parseEle(value) {
  const ele = Number.parseFloat(value);
  return Number.isFinite(ele) ? Math.round(ele) : undefined;
}

async function fetchElements() {
  const failures = [];
  for (const url of OVERPASS) {
    try {
      const response = await fetch(url, {
        method: "POST",
        // Overpass answers 406 without a User-Agent.
        headers: { "User-Agent": "skitouring-map (data:signposts script)" },
        body: new URLSearchParams({ data: QUERY }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) return (await response.json()).elements;
      failures.push(`${url}: ${response.status} ${response.statusText}`);
    } catch (error) {
      failures.push(`${url}: ${error.message}`);
    }
    console.warn(`Overpass failed, ${failures.at(-1)}`);
  }
  throw new Error(`All Overpass servers failed:\n${failures.join("\n")}`);
}

const elements = await fetchElements();

// Posts with an elevation first, so they win over their duplicates.
const posts = elements
  .filter((node) => isHikingPost(node.tags))
  .map((node) => ({
    lat: node.lat,
    lon: node.lon,
    name: node.tags.name.trim(),
    ele: parseEle(node.tags.ele),
  }))
  .sort((a, b) => Number(b.ele !== undefined) - Number(a.ele !== undefined));

const kept = [];
for (const post of posts) {
  const duplicate = kept.some(
    (other) =>
      other.name === post.name &&
      distanceMetres(other, post) < DUPLICATE_METRES,
  );
  if (!duplicate) kept.push(post);
}

// Stable order keeps builds reproducible for the same OSM data.
kept.sort(
  (a, b) =>
    a.name.localeCompare(b.name, "pl") || a.lat - b.lat || a.lon - b.lon,
);

const collection = {
  type: "FeatureCollection",
  features: kept.map(({ lat, lon, name, ele }) => ({
    type: "Feature",
    properties: ele === undefined ? { name } : { name, ele },
    geometry: {
      type: "Point",
      coordinates: [Number(lon.toFixed(6)), Number(lat.toFixed(6))],
    },
  })),
};

// src/data/ holds nothing tracked, so it is missing on a fresh checkout.
await mkdir(new URL(".", OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify(collection) + "\n");
console.log(`Wrote ${kept.length} signposts to ${OUTPUT.pathname}`);
