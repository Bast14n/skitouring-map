import { MAX_ZOOM, MIN_ZOOM, TATRA_BOUNDS } from "./config.ts";

export type MapPosition = {
  center: [number, number]; // [lng, lat]
  zoom: number;
};

// Same order as MapLibre's own hash: zoom/lat/lng.
export function formatMapParam({ center, zoom }: MapPosition): string {
  const [lng, lat] = center;
  return `${+zoom.toFixed(2)}/${+lat.toFixed(5)}/${+lng.toFixed(5)}`;
}

// Returns null for anything malformed or outside the map area, so an old or
// broken link falls back to the default view.
export function parseMapParam(value: string | null): MapPosition | null {
  if (!value) return null;
  const parts = value.split("/");
  if (parts.length !== 3) return null;

  const [zoom, lat, lng] = parts.map(Number);
  if (![zoom, lat, lng].every(Number.isFinite)) return null;
  if (zoom < MIN_ZOOM || zoom > MAX_ZOOM) return null;

  const [[west, south], [east, north]] = TATRA_BOUNDS;
  if (lng < west || lng > east || lat < south || lat > north) return null;

  return { center: [lng, lat], zoom };
}
