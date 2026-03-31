import type { Cabana, MapTile } from "../../types/map";
import "./ResortMapTile.css";

type ResortMapTileProps = {
  tile: MapTile;
  cabana?: Cabana;
  isSelected: boolean;
  imageSrc: string;
  imageRotation: number;
  onClick: () => void;
};

function ResortMapTile({
  tile,
  cabana,
  isSelected,
  imageSrc,
  imageRotation,
  onClick,
}: ResortMapTileProps) {
  const className = [
    "tile",
    `tile-${tile.type}`,
    tile.type === "cabana" ? "tile-clickable" : "",
    isSelected ? "tile-selected" : "",
    cabana
      ? cabana.isAvailable
        ? "tile-cabana-available"
        : "tile-cabana-unavailable"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const title = cabana
    ? `${cabana.id} - ${cabana.isAvailable ? "Available" : "Unavailable"}`
    : tile.type;

  return (
    <button className={className} onClick={onClick} title={title}>
      <img
        src={imageSrc}
        alt={tile.type}
        className="tile-image"
        style={{ transform: `rotate(${imageRotation}deg)` }}
      />
    </button>
  );
}

export default ResortMapTile;
