import fs from "fs";
import path from "path";
import {
  Cabana,
  MapGrid,
  MapSymbol,
  MapTile,
  ParsedMap,
  TileType,
} from "../types/map.types";

const VALID_SYMBOLS: MapSymbol[] = ["W", "p", "#", "c", "."];

function getTileType(symbol: MapSymbol): TileType {
  switch (symbol) {
    case "W":
      return "cabana";
    case "p":
      return "pool";
    case "#":
      return "path";
    case "c":
      return "chalet";
    case ".":
      return "empty";
  }
}

export function parseMapFile(filePath: string): ParsedMap {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");

  const lines = fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const firstLine = lines[0];

  if (!firstLine) {
    throw new Error("Map file is empty.");
  }

  const cols = firstLine.length;

  const allLinesHaveSameLength = lines.every((line) => line.length === cols);

  if (!allLinesHaveSameLength) {
    throw new Error("Map file must have equal-length rows.");
  }

  const grid: MapGrid = [];
  const tiles: MapTile[] = [];
  const cabanas: Cabana[] = [];

  let cabanaCounter = 1;

  lines.forEach((line, y) => {
    const row: MapSymbol[] = [];

    [...line].forEach((char, x) => {
      if (!VALID_SYMBOLS.includes(char as MapSymbol)) {
        throw new Error(`Invalid map symbol "${char}" at row ${y}, col ${x}.`);
      }

      const symbol = char as MapSymbol;
      const type = getTileType(symbol);

      row.push(symbol);

      tiles.push({
        x,
        y,
        symbol,
        type,
      });

      if (symbol === "W") {
        cabanas.push({
          id: `cabana-${cabanaCounter}`,
          x,
          y,
          isAvailable: true,
        });

        cabanaCounter += 1;
      }
    });

    grid.push(row);
  });

  return {
    rows: lines.length,
    cols,
    grid,
    tiles,
    cabanas,
  };
}
