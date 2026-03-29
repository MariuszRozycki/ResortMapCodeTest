import { useState, useEffect, useMemo } from "react";
import { fetchResortMap } from "./api/mapApi";
import type {
  ResortMapResponse,
  Cabana,
  TileType,
  MapTile,
  PathTileDisplay,
} from "./types/map";
import parchmentBasic from "../../assets/parchmentBasic.png";
import cabanaImage from "../../assets/cabana.png";
import chaletImage from "../../assets/houseChimney.png";
import poolImage from "../../assets/pool.png";
import arrowStraight from "../../assets/arrowStraight.png";
import arrowCornerSquare from "../../assets/arrowCornerSquare.png";
import arrowCrossing from "../../assets/arrowCrossing.png";
import arrowEnd from "../../assets/arrowEnd.png";
import arrowSplit from "../../assets/arrowSplit.png";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState<ResortMapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);

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

  const tilesMap = useMemo(() => {
    if (!mapData) {
      return new Map<string, MapTile>();
    }

    return new Map(mapData.tiles.map((tile) => [`${tile.x}-${tile.y}`, tile]));
  }, [mapData]);

  function getTileAt(x: number, y: number) {
    return tilesMap.get(`${x}-${y}`);
  }

  function isPathAt(x: number, y: number) {
    return getTileAt(x, y)?.type === "path";
  }

  function getPathTileDisplay(x: number, y: number): PathTileDisplay {
    const top = isPathAt(x, y - 1);
    const right = isPathAt(x + 1, y);
    const bottom = isPathAt(x, y + 1);
    const left = isPathAt(x - 1, y);

    const connections = [top, right, bottom, left].filter(Boolean).length;

    if (connections === 4) {
      return {
        image: arrowCrossing,
        rotation: 0,
      };
    }

    if (connections === 3) {
      if (!top) {
        return { image: arrowSplit, rotation: 90 };
      }

      if (!right) {
        return { image: arrowSplit, rotation: 180 };
      }

      if (!bottom) {
        return { image: arrowSplit, rotation: 270 };
      }

      return { image: arrowSplit, rotation: 0 };
    }

    if (connections === 2) {
      if (top && bottom) {
        return { image: arrowStraight, rotation: 0 };
      }

      if (left && right) {
        return { image: arrowStraight, rotation: 90 };
      }

      if (top && right) {
        return { image: arrowCornerSquare, rotation: 0 };
      }

      if (right && bottom) {
        return { image: arrowCornerSquare, rotation: 90 };
      }

      if (bottom && left) {
        return { image: arrowCornerSquare, rotation: 180 };
      }

      return { image: arrowCornerSquare, rotation: 270 };
    }

    if (connections === 1) {
      if (top) {
        return { image: arrowEnd, rotation: 0 };
      }

      if (right) {
        return { image: arrowEnd, rotation: -90 };
      }

      if (bottom) {
        return { image: arrowEnd, rotation: 180 };
      }

      if (left) {
        return { image: arrowEnd, rotation: 90 };
      }
    }

    return {
      image: arrowEnd,
      rotation: 0,
    };
  }

  function getTileImage(tileType: TileType) {
    switch (tileType) {
      case "cabana":
        return cabanaImage;
      case "chalet":
        return chaletImage;
      case "pool":
        return poolImage;
      case "empty":
        return parchmentBasic;
      case "path":
        return parchmentBasic;
      default:
        return parchmentBasic;
    }
  }

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

            const pathDisplay =
              tile.type === "path" ? getPathTileDisplay(tile.x, tile.y) : null;

            const imageSrc = pathDisplay
              ? pathDisplay.image
              : getTileImage(tile.type);

            const imageRotation = pathDisplay ? pathDisplay.rotation : 0;

            return (
              <div
                key={`${tile.x}-${tile.y}`}
                className={[
                  "tile",
                  `tile-${tile.type}`,
                  tile.type === "cabana" ? "tile-clickable" : "",
                  selectedCabana?.id === cabana?.id ? "tile-selected" : "",
                  cabana
                    ? cabana.isAvailable
                      ? "tile-cabana-available"
                      : "tile-cabana-unavailable"
                    : "",
                ].join(" ")}
                onClick={() => {
                  if (tile.type !== "cabana") return;

                  const clickedCabana =
                    cabanasMap.get(`${tile.x}-${tile.y}`) ?? null;
                  setSelectedCabana(clickedCabana);
                }}
                title={`x: ${tile.x}, y: ${tile.y}, symbol: ${tile.symbol}, type: ${tile.type}${
                  cabana
                    ? `, id: ${cabana.id}, available: ${cabana.isAvailable}`
                    : ""
                }`}
              >
                <img
                  src={imageSrc}
                  alt={tile.type}
                  className="tile-image"
                  style={{ transform: `rotate(${imageRotation}deg)` }}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="details-panel">
        <h2>Selected cabana</h2>

        {selectedCabana ? (
          <>
            <p>
              <strong>ID:</strong> {selectedCabana.id}
            </p>
            <p>
              <strong>Position:</strong> ({selectedCabana.x}, {selectedCabana.y}
              )
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedCabana.isAvailable ? "Available" : "Unavailable"}
            </p>
          </>
        ) : (
          <p>Click a cabana on the map to see details.</p>
        )}
      </section>
    </main>
  );
}

export default App;
