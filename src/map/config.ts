import {
  addProtocol,
  type LngLatLike,
  type RasterDEMSourceSpecification,
  type StyleSpecification,
} from "maplibre-gl";
import mlcontour from "maplibre-contour";
import signpostsUrl from "../data/signposts.geojson?url";
import winterStyle from "./winter-style.json";

// OpenFreeMap Liberty recoloured for winter (spec section 5.2). Tiles, sprite
// and fonts still come from OpenFreeMap. Trail signposts are a local OSM
// snapshot fetched at build time (`npm run data:signposts`), loaded as a file,
// not bundled.
const baseStyle = winterStyle as StyleSpecification;

// Contour lines are traced in a web worker from the same Mapterhorn tiles as
// the hillshade. The protocol must be registered before the map is created.
const terrain = baseStyle.sources.terrain as RasterDEMSourceSpecification;
const demSource = new mlcontour.DemSource({
  url: terrain.tiles![0],
  encoding: "terrarium",
  maxzoom: terrain.maxzoom!,
  worker: true,
});
addProtocol(demSource.contourProtocolId, demSource.contourProtocolV4);

// [minor, index] interval in metres per zoom; every fifth line is an index line.
const contourUrl = demSource.contourProtocolUrl({
  thresholds: {
    12: [100, 500],
    13: [50, 250],
    14: [20, 100],
    15: [10, 50],
  },
  contourLayer: "contours",
  elevationKey: "ele",
  levelKey: "level",
});

export const MAP_STYLE: StyleSpecification = {
  ...baseStyle,
  sources: {
    ...baseStyle.sources,
    signposts: { type: "geojson", data: signpostsUrl },
    contours: { type: "vector", tiles: [contourUrl], maxzoom: 15 },
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
