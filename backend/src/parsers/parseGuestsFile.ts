import fs from "fs";
import path from "path";
import { GuestBookingRecord } from "../types/booking.types";

export function parseGuestsFile(filePath: string): GuestBookingRecord[] {
  const absolutePath = path.resolve(filePath);
  const fileContent = fs.readFileSync(absolutePath, "utf-8");
  const parsedContent = JSON.parse(fileContent);

  if (!Array.isArray(parsedContent)) {
    throw new Error("Bookings file must contain an array of guest records.");
  }

  return parsedContent as GuestBookingRecord[];
}
