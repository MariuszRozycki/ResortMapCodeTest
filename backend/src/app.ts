import express from "express";
import cors from "cors";
import { CliConfig } from "./config/cli";

export function createApp(config: CliConfig) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // test endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}
