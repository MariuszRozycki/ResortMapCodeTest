import { ParsedMap } from "../types/map.types";
import { parseMapFile } from "../parsers/parseMapFile";

let cachedMap: ParsedMap | null = null;

export function loadMap(filePath: string): ParsedMap {
  if (!cachedMap) {
    cachedMap = parseMapFile(filePath);
  }

  return cachedMap;
}
