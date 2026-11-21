// Fetches the trail signposts (OSM guideposts) in the Tatras and writes them to
// src/data/signposts.geojson. Run with `npm run data:signposts`; CI runs it
// before every build, so the file is gitignored, not committed.
// Data © OpenStreetMap contributors, ODbL.
import { mkdir, writeFile } from "node:fs/promises";

const OUTPUT = new URL("../src/data/signposts.geojson", import.meta.url);
const OVERPASS = "https://overpass-api.de/api/interpreter";
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

const response = await fetch(OVERPASS, {
  method: "POST",
  // Overpass answers 406 without a User-Agent.
  headers: { "User-Agent": "skitouring-map (data:signposts script)" },
  body: new URLSearchParams({ data: QUERY }),
});
if (!response.ok) {
  throw new Error(
    `Overpass answered ${response.status} ${response.statusText}`,
  );
}
const { elements } = await response.json();

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
await writeFile(OUTPUT,JSON.stringify(collection) + "\n");
console.log(`Wrote ${kept.length} signposts to ${OUTPUT.pathname}`);
