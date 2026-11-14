import { Link } from "react-router";

// Placeholder; the final page arrives in T28.
function NotFoundPage() {
  return (
    <div className="page">
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back to the map</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
