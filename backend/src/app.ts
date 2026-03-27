import express from "express";
import cors from "cors";
import { CliConfig } from "./config/cli";
import { createMapRouter } from "./routes/map.routes";

export function createApp(config: CliConfig) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api", createMapRouter(config));

  app.get("/api/map", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
