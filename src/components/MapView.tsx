import { useEffect, useRef } from "react";
import { Map, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  INITIAL_ZOOM,
  MAX_ZOOM,
  MIN_ZOOM,
  STYLE_URL,
  TATRA_BOUNDS,
  TATRA_CENTER,
} from "../map/config.ts";
import "./MapView.css";

// MapLibre looks for its worker next to its own module, which Vite moves when
// bundling, so point it at the worker file explicitly.
setWorkerUrl(workerUrl);

function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: TATRA_CENTER,
      zoom: INITIAL_ZOOM,
      maxBounds: TATRA_BOUNDS,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className="map-view" />;
}

export default MapView;
