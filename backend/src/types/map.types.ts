export type MapSymbol = "W" | "p" | "#" | "c" | ".";

export type MapGrid = MapSymbol[][];

export type TileType = "cabana" | "pool" | "path" | "chalet" | "empty";

export type MapTile = {
  x: number;
  y: number;
  symbol: MapSymbol;
  type: TileType;
};

export type Cabana = {
  id: string;
  x: number;
  y: number;
  isAvailable: boolean;
};

export type ParsedMap = {
  rows: number;
  cols: number;
  grid: MapGrid;
  tiles: MapTile[];
  cabanas: Cabana[];
};
