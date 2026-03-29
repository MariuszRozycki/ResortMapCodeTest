import { useState, useEffect, useMemo } from "react";
import { fetchResortMap } from "./api/mapApi";
import type { ResortMapResponse, Cabana } from "./types/map";
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

  const cabanasMap = useMemo(() => {
    if (!mapData) {
      return new Map<string, Cabana>();
    }

    return new Map(
      mapData.cabanas.map((cabana) => [`${cabana.x}-${cabana.y}`, cabana]),
    );
  }, [mapData]);

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
    <main className="app">
      <h1>Resort Map</h1>

      <section className="stats">
        <p>Rows: {mapData.rows}</p>
        <p>Columns: {mapData.cols}</p>
        <p>Cabanas: {mapData.cabanas.length}</p>
        <p>Tiles: {mapData.tiles.length}</p>
      </section>

      <section className="map-wrapper">
        <div
          className="map-grid"
          style={{ gridTemplateColumns: `repeat(${mapData.cols}, 32px)` }}
        >
          {mapData.tiles.map((tile) => {
            const cabana = cabanasMap.get(`${tile.x}-${tile.y}`);

            return (
              <div
                key={`${tile.x}-${tile.y}`}
                className={[
                  "tile",
                  `tile-${tile.type}`,
                  cabana
                    ? cabana.isAvailable
                      ? "tile-cabana-available"
                      : "tile-cabana-unavailable"
                    : "",
                ].join(" ")}
                title={`x: ${tile.x}, y: ${tile.y}, symbol: ${tile.symbol}, type: ${tile.type}${
                  cabana
                    ? `, id: ${cabana.id}, available: ${cabana.isAvailable}`
                    : ""
                }`}
              >
                {tile.symbol}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default App;
