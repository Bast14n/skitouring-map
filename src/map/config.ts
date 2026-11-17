import type { LngLatLike } from "maplibre-gl";

// OpenFreeMap style used as-is until the winter style (T08).
export const STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

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
