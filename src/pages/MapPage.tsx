import { useParams } from "react-router";

// Placeholder; the map arrives in T05.
function MapPage() {
  const { id } = useParams();

  return (
    <div className="page">
      <h1>Map</h1>
      <p>{id ? `Route: ${id}` : "The winter map of the Tatras goes here."}</p>
    </div>
  );
}

export default MapPage;
