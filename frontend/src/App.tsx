import { useState, useEffect } from "react";
import { fetchResortMap } from "./api/mapApi";
import type { ResortMapResponse } from "./types/map";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState<ResortMapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMap() {
      try {
        const data = await fetchResortMap();
        setMapData(data);
      } catch (err) {
        setError("Could not load resort map.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMap();
  }, []);

  if (isLoading) {
    return <p>Loading map...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!mapData) {
    return <p>No map data available.</p>;
  }

  return (
    <main>
      <h1>Resort Map</h1>
      <p>Rows: {mapData.rows}</p>
      <p>Columns: {mapData.cols}</p>
      <p>Cabanas: {mapData.cabanas.length}</p>
      <p>Tiles: {mapData.tiles.length}</p>
    </main>
  );
}

export default App;
