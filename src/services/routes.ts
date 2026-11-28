import type { Feature, FeatureCollection, LineString } from "geojson";
import routesRaw from "../data/routes.geojson?raw";

// The only way into route data. The rest of the app must not import
// routes.geojson directly, so the file can later be replaced by a database.

export type RouteProperties = { id: string; name: string };
export type Route = Feature<LineString, RouteProperties>;

const collection = JSON.parse(routesRaw) as FeatureCollection<
  LineString,
  RouteProperties
>;

// "pl" orders Polish letters (ą, ł, ś…) next to their base letter instead of after "z".
const collator = new Intl.Collator("pl");

const routes: readonly Route[] = [...collection.features].sort((a, b) =>
  collator.compare(a.properties.name, b.properties.name),
);

const routesById = new Map(routes.map((route) => [route.properties.id, route]));

/** All routes, sorted by name. */
export function getRoutes(): readonly Route[] {
  return routes;
}

export function getRouteById(id: string): Route | undefined {
  return routesById.get(id);
}
