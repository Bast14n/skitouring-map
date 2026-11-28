import { describe, expect, it } from "vitest";
import { getRouteById, getRoutes } from "./routes";

describe("getRoutes", () => {
  it("returns every route as a named LineString", () => {
    const routes = getRoutes();
    expect(routes).toHaveLength(3);
    for (const route of routes) {
      expect(route.properties.id).toBeTruthy();
      expect(route.properties.name).toBeTruthy();
      expect(route.geometry.type).toBe("LineString");
      expect(route.geometry.coordinates.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("sorts names with Polish collation", () => {
    expect(getRoutes().map((route) => route.properties.id)).toEqual([
      "zielony-staw",
      "kasprowy-goryczkowa",
      "lomnicke-sedlo",
    ]);
  });

  it("has unique ids", () => {
    const ids = getRoutes().map((route) => route.properties.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getRouteById", () => {
  it("returns the route with that id", () => {
    expect(getRouteById("kasprowy-goryczkowa")?.properties.name).toBe(
      "Kuźnice – Kasprowy Wierch (Dolina Goryczkowa)",
    );
  });

  it("returns undefined for an unknown id", () => {
    expect(getRouteById("does-not-exist")).toBeUndefined();
  });
});
