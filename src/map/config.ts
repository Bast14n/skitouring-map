import type { LngLatLike, StyleSpecification } from "maplibre-gl";
import signpostsUrl from "../data/signposts.geojson?url";
import winterStyle from "./winter-style.json";

// OpenFreeMap Liberty recoloured for winter (spec section 5.2). Tiles, sprite
// and fonts still come from OpenFreeMap. Trail signposts are a local OSM
// snapshot (`npm run data:signposts`), loaded as a file, not bundled.
const baseStyle = winterStyle as StyleSpecification;
export const MAP_STYLE: StyleSpecification = {
  ...baseStyle,
  sources: {
    ...baseStyle.sources,
    signposts: { type: "geojson", data: signpostsUrl },
  },
};

export const TATRA_CENTER: LngLatLike = [20.0, 49.2];
export const INITIAL_ZOOM = 10.5;
// The Tatras (about 19.6–20.4 E, 49.05–49.35 N) plus a wide margin, north far
// enough that Myślenice (49.835 N) stays on the map.
export const TATRA_BOUNDS: [[number, number], [number, number]] = [
  [18.9, 48.7],
  [21.1, 50.0],
];
export const MIN_ZOOM = 9;
export const MAX_ZOOM = 19;

// Query parameter inside the hash route that holds the map position.
export const MAP_PARAM = "map";
