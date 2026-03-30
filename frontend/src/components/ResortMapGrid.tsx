import { useMemo } from "react";
import type { ResortMapResponse, Cabana } from "../types/map";
import ResortMapTile from "./ResortMapTile";
import { getPathTileDisplay, getTileImage } from "../utils/mapDisplay";

type ResortMapGridProps = {
  mapData: ResortMapResponse;
  selectedCabana: Cabana | null;
  onCabanaSelect: (cabana: Cabana | null) => void;
};

function ResortMapGrid({
  mapData,
  selectedCabana,
  onCabanaSelect,
}: ResortMapGridProps) {
  const cabanasMap = useMemo(() => {
    return new Map(
      mapData.cabanas.map((cabana) => [`${cabana.x}-${cabana.y}`, cabana]),
    );
  }, [mapData.cabanas]);

  const tilesMap = useMemo(() => {
    return new Map(mapData.tiles.map((tile) => [`${tile.x}-${tile.y}`, tile]));
  }, [mapData.tiles]);

  return (
    <section className="map-wrapper">
      <div
        className="map-grid"
        style={{ gridTemplateColumns: `repeat(${mapData.cols}, 32px)` }}
      >
        {mapData.tiles.map((tile) => {
          const cabana = cabanasMap.get(`${tile.x}-${tile.y}`);

          const pathDisplay =
            tile.type === "path"
              ? getPathTileDisplay(tile.x, tile.y, tilesMap)
              : null;

          const imageSrc = pathDisplay
            ? pathDisplay.image
            : getTileImage(tile.type);

          const imageRotation = pathDisplay ? pathDisplay.rotation : 0;

          const isSelectedCabana =
            selectedCabana !== null &&
            cabana !== undefined &&
            selectedCabana.id === cabana.id;

          return (
            <ResortMapTile
              key={`${tile.x}-${tile.y}`}
              tile={tile}
              cabana={cabana}
              isSelected={isSelectedCabana}
              imageSrc={imageSrc}
              imageRotation={imageRotation}
              onClick={() => {
                if (tile.type !== "cabana") {
                  return;
                }

                const clickedCabana =
                  cabanasMap.get(`${tile.x}-${tile.y}`) ?? null;

                onCabanaSelect(clickedCabana);
              }}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ResortMapGrid;
