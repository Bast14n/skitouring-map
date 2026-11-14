// Temporary token preview; replaced by the router in T04.
function App() {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "56px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 44 }}>Safety and rules</h1>
      <p
        style={{
          margin: 0,
          fontSize: 19,
          color: "var(--color-text-secondary)",
        }}
      >
        This map shows where the allowed ski touring routes run and how steep
        the terrain is. The decision to go is yours, so check the official
        sources below on the day of your tour.
      </p>
      <p style={{ margin: 0 }}>
        A route drawn on the map may be closed today, and the slope overlay is a
        planning aid, not an avalanche assessment.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" className="button">
          Show on map
        </button>
        <button type="button" className="button button--secondary">
          Copy link
        </button>
      </div>
    </main>
  );
}

export default App;
