import { Router } from "express";
import { BookCabanaRequestBody } from "../types/booking.types";
import { loadMap } from "../services/map.service";
import { CliConfig } from "../config/cli";
import { BookingService } from "../services/booking.service";

export function createMapRouter(config: CliConfig) {
  const router = Router();
  const bookingService = new BookingService(config.bookingsFilePath);

  router.get("/map", (_req, res) => {
    try {
      const map = loadMap(config.mapPath);
      const cabanasWithAvailability = bookingService.mergeCabanaAvailability(
        map.cabanas,
      );

      res.json({
        rows: map.rows,
        cols: map.cols,
        tiles: map.tiles,
        cabanas: cabanasWithAvailability,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to load map",
      });
    }
  });

  router.post("/cabanas/:cabanaId/book", (req, res) => {
    try {
      const map = loadMap(config.mapPath);
      const { cabanaId } = req.params;
      const body = req.body as Partial<BookCabanaRequestBody>;

      const roomNumber = body.roomNumber?.trim();
      const guestName = body.guestName?.trim();

      if (!roomNumber || !guestName) {
        return res.status(400).json({
          success: false,
          message: "Room number and guest name are required.",
        });
      }

      const result = bookingService.bookCabana(
        cabanaId,
        {
          roomNumber,
          guestName,
        },
        map.cabanas,
      );

      if (!result.success) {
        const statusCode =
          result.message === "Cabana not found."
            ? 404
            : result.message === "This cabana is no longer available."
              ? 409
              : 400;

        return res.status(statusCode).json(result);
      }

      return res.status(200).json(result);
    } catch {
      return res.status(500).json({
        success: false,
        message: "Failed to book cabana.",
      });
    }
  });

  return router;
}
