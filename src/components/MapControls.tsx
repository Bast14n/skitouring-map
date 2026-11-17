import "./MapControls.css";

type MapControlsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  message: string | null;
};

// Top-right control stack: zoom group, then the locate button. The slope
// button (T22) goes below it.
function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  message,
}: MapControlsProps) {
  return (
    <div className="map-controls">
      <div className="map-controls__group">
        <button
          type="button"
          className="map-controls__button"
          aria-label="Zoom in"
          onClick={onZoomIn}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          className="map-controls__button"
          aria-label="Zoom out"
          onClick={onZoomOut}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
      </div>
      <div className="map-controls__group">
        <button
          type="button"
          className="map-controls__button"
          aria-label="Show my location"
          onClick={onLocate}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
      </div>
      <p className="map-controls__message" role="status">
        {message}
      </p>
    </div>
  );
}

export default MapControls;
