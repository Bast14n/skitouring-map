import { Route, Routes } from "react-router";
import Header from "./components/Header.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import InfoPage from "./pages/InfoPage.tsx";
import MapPage from "./pages/MapPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/routes/:id" element={<MapPage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
