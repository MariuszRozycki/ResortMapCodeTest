import type { MapTile, PathTileDisplay, TileType } from "../types/map";
import parchmentBasic from "../../../assets/parchmentBasic.png";
import cabanaImage from "../../../assets/cabana.png";
import chaletImage from "../../../assets/houseChimney.png";
import poolImage from "../../../assets/pool.png";
import arrowStraight from "../../../assets/arrowStraight.png";
import arrowCornerSquare from "../../../assets/arrowCornerSquare.png";
import arrowCrossing from "../../../assets/arrowCrossing.png";
import arrowEnd from "../../../assets/arrowEnd.png";
import arrowSplit from "../../../assets/arrowSplit.png";

export function getTileImage(tileType: TileType) {
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

export function getPathTileDisplay(
  x: number,
  y: number,
  tilesMap: Map<string, MapTile>,
): PathTileDisplay {
  function getTileAt(tileX: number, tileY: number) {
    return tilesMap.get(`${tileX}-${tileY}`);
  }

  function isPathAt(tileX: number, tileY: number) {
    return getTileAt(tileX, tileY)?.type === "path";
  }

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
