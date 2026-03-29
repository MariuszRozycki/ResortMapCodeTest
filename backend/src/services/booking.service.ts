import fs from "fs";
import path from "path";
import type { Cabana } from "../types/map.types";
import type {
  GuestBookingRecord,
  BookCabanaRequestBody,
  BookCabanaResult,
} from "../types/booking.types";

export class BookingService {
  private guests: GuestBookingRecord[];
  private bookedCabanaIds: Set<string>;

  constructor(bookingsFilePath: string) {
    this.guests = this.loadGuests(bookingsFilePath);
    this.bookedCabanaIds = new Set();
  }

  private loadGuests(filePath: string): GuestBookingRecord[] {
    const absolutePath = path.resolve(filePath);
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    return JSON.parse(fileContent) as GuestBookingRecord[];
  }

  mergeCabanaAvailability(cabanas: Cabana[]): Cabana[] {
    return cabanas.map((cabana) => ({
      ...cabana,
      isAvailable: !this.bookedCabanaIds.has(cabana.id),
    }));
  }

  bookCabana(
    cabanaId: string,
    payload: BookCabanaRequestBody,
    cabanas: Cabana[],
  ): BookCabanaResult {
    const cabanaExists = cabanas.some((cabana) => cabana.id === cabanaId);

    if (!cabanaExists) {
      return {
        success: false,
        message: "Cabana not found.",
      };
    }

    if (this.bookedCabanaIds.has(cabanaId)) {
      return {
        success: false,
        message: "This cabana is no longer available.",
      };
    }

    const roomNumber = payload.roomNumber.trim();
    const guestName = payload.guestName.trim().toLowerCase();

    const matchingGuest = this.guests.find(
      (guest) =>
        guest.room === roomNumber &&
        guest.guestName.trim().toLowerCase() === guestName,
    );

    if (!matchingGuest) {
      return {
        success: false,
        message: "Guest name and room number do not match a current guest.",
      };
    }

    this.bookedCabanaIds.add(cabanaId);

    return {
      success: true,
      message: "Cabana booked successfully.",
      cabana: {
        id: cabanaId,
        isAvailable: false,
      },
    };
  }
}
