import { Router } from "express";
import { loadMap } from "../services/map.service";
import { CliConfig } from "../config/cli";

export function createMapRouter(config: CliConfig) {
  const router = Router();

  router.get("/map", (req, res) => {
    try {
      const map = loadMap(config.mapPath);

      res.json({
        rows: map.rows,
        cols: map.cols,
        tiles: map.tiles,
        cabanas: map.cabanas,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to load map",
      });
    }
  });

  return router;
}
