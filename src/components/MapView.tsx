import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { GeolocateControl, Map, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  INITIAL_ZOOM,
  MAP_PARAM,
  MAX_ZOOM,
  MIN_ZOOM,
  STYLE_URL,
  TATRA_BOUNDS,
  TATRA_CENTER,
} from "../map/config.ts";
import { formatMapParam, parseMapParam } from "../map/position.ts";
import MapControls from "./MapControls.tsx";
import "./MapView.css";

// MapLibre looks for its worker next to its own module, which Vite moves when
// bundling, so point it at the worker file explicitly.
setWorkerUrl(workerUrl);

function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const geolocateRef = useRef<GeolocateControl | null>(null);
  const quietLocateRef = useRef(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  // Read only when the map is created; later address changes come from us.
  const initialPosition = useEffectEvent(() =>
    parseMapParam(searchParams.get(MAP_PARAM)),
  );

  // MapLibre's own `hash` option clashes with hash routing, so the position
  // lives in a query parameter. `replace` keeps the back button usable.
  const syncAddress = useEffectEvent((map: Map) => {
    const { lng, lat } = map.getCenter();
    const value = formatMapParam({ center: [lng, lat], zoom: map.getZoom() });
    if (searchParams.get(MAP_PARAM) === value) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(MAP_PARAM, value);
        return next;
      },
      { replace: true },
    );
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const position = initialPosition();

    // No NavigationControl: MapControls draws the zoom buttons. The default
    // attribution control stays.
    const map = new Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: position?.center ?? TATRA_CENTER,
      zoom: position?.zoom ?? INITIAL_ZOOM,
      maxBounds: TATRA_BOUNDS,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
    });

    // Fires once per pan, zoom or fly, not on every frame.
    map.on("moveend", () => syncAddress(map));

    // One-shot locate: draws the dot and centres once. Its own button is
    // hidden in CSS and MapControls calls trigger(). A position outside
    // maxBounds fires outofmaxbounds and leaves the camera where it is.
    const geolocate = new GeolocateControl({
      positionOptions: { enableHighAccuracy: true, timeout: 10000 },
      fitBoundsOptions: { maxZoom: 15 },
      // The circle can cover kilometres on low-accuracy devices and hides the map.
      showAccuracyCircle: false,
    });
    // The automatic locate on opening stays quiet on failure; messages are
    // only for a press of the button.
    geolocate.on("geolocate", () => (quietLocateRef.current = false));
    geolocate.on("error", (error) => {
      if (quietLocateRef.current) {
        quietLocateRef.current = false;
        return;
      }
      setMessage(
        error.code === GeolocationPositionError.PERMISSION_DENIED
          ? "Location access is blocked. Allow it in your browser settings."
          : "Your position is not available right now.",
      );
    });
    geolocate.on("outofmaxbounds", () => {
      if (quietLocateRef.current) {
        quietLocateRef.current = false;
        return;
      }
      setMessage("You are outside the map area.");
    });
    map.addControl(geolocate, "top-right");

    // Locate on opening, unless the address already holds a shared view.
    if (!position && "geolocation" in navigator) {
      map.once("load", () => {
        quietLocateRef.current = true;
        geolocate.trigger();
      });
    }

    mapRef.current = map;
    geolocateRef.current = geolocate;

    return () => {
      map.remove();
      mapRef.current = null;
      geolocateRef.current = null;
    };
  }, []);

  function locate() {
    if (!("geolocation" in navigator)) {
      setMessage("Your browser cannot share your location.");
      return;
    }
    setMessage(null);
    quietLocateRef.current = false;
    geolocateRef.current?.trigger();
  }

  return (
    <>
      {/* MapLibre owns the container's children, so controls sit beside it. */}
      <div ref={containerRef} className="map-view" />
      <MapControls
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onLocate={locate}
        message={message}
      />
    </>
  );
}

export default MapView;
