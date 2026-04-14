import { describe, expect, it } from "vitest";
import { getPathTileDisplay, getTileImage } from "./mapDisplay";
import type { MapTile, TileType } from "../types/map";

import parchmentBasic from "../assets/parchmentBasic.png";
import cabanaImage from "../assets/cabana.png";
import chaletImage from "../assets/houseChimney.png";
import poolImage from "../assets/pool.png";
import arrowStraight from "../assets/arrowStraight.png";
import arrowCornerSquare from "../assets/arrowCornerSquare.png";
import arrowCrossing from "../assets/arrowCrossing.png";
import arrowEnd from "../assets/arrowEnd.png";
import arrowSplit from "../assets/arrowSplit.png";

function createTile(x: number, y: number, type: TileType): MapTile {
  const symbolMap: Record<TileType, MapTile["symbol"]> = {
    cabana: "W",
    pool: "p",
    path: "#",
    chalet: "c",
    empty: ".",
  };

  return {
    x,
    y,
    type,
    symbol: symbolMap[type],
  };
}

function createTilesMap(tiles: MapTile[]) {
  return new Map(tiles.map((tile) => [`${tile.x}-${tile.y}`, tile]));
}

describe("getTileImage", () => {
  it("returns cabana image for cabana tile", () => {
    expect(getTileImage("cabana")).toBe(cabanaImage);
  });

  it("returns chalet image for chalet tile", () => {
    expect(getTileImage("chalet")).toBe(chaletImage);
  });

  it("returns pool image for pool tile", () => {
    expect(getTileImage("pool")).toBe(poolImage);
  });

  it("returns parchment image for empty tile", () => {
    expect(getTileImage("empty")).toBe(parchmentBasic);
  });

  it("returns parchment image for path tile", () => {
    expect(getTileImage("path")).toBe(parchmentBasic);
  });
});

describe("getPathTileDisplay", () => {
  it("returns crossing image for 4 connected paths", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(1, 0, "path"),
      createTile(2, 1, "path"),
      createTile(1, 2, "path"),
      createTile(0, 1, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowCrossing,
      rotation: 0,
    });
  });

  it("returns split image rotated 90 when top connection is missing", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(2, 1, "path"),
      createTile(1, 2, "path"),
      createTile(0, 1, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowSplit,
      rotation: 90,
    });
  });

  it("returns straight image for vertical path", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(1, 0, "path"),
      createTile(1, 2, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowStraight,
      rotation: 0,
    });
  });

  it("returns straight image for horizontal path", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(0, 1, "path"),
      createTile(2, 1, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowStraight,
      rotation: 90,
    });
  });

  it("returns corner image for top-right turn", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(1, 0, "path"),
      createTile(2, 1, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowCornerSquare,
      rotation: 0,
    });
  });

  it("returns corner image for right-bottom turn", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(2, 1, "path"),
      createTile(1, 2, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowCornerSquare,
      rotation: 90,
    });
  });

  it("returns end image rotated 180 when connected only to the top", () => {
    const tilesMap = createTilesMap([
      createTile(1, 1, "path"),
      createTile(1, 0, "path"),
    ]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowEnd,
      rotation: 180,
    });
  });

  it("returns default end image when there are no connections", () => {
    const tilesMap = createTilesMap([createTile(1, 1, "path")]);

    const result = getPathTileDisplay(1, 1, tilesMap);

    expect(result).toEqual({
      image: arrowEnd,
      rotation: 0,
    });
  });
});
