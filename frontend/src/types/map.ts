export type TileType = "cabana" | "pool" | "path" | "chalet" | "empty";

export type MapSymbol = "W" | "p" | "#" | "c" | ".";

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

export type ResortMapResponse = {
  rows: number;
  cols: number;
  tiles: MapTile[];
  cabanas: Cabana[];
};
