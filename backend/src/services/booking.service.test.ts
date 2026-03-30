import fs from "fs";
import os from "os";
import path from "path";
import { beforeEach, describe, expect, it } from "vitest";
import { BookingService } from "./booking.service";
import { Cabana } from "../types/map.types";

function createTempBookingsFile(content: unknown): string {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "booking-service-test-"),
  );
  const filePath = path.join(tempDir, "bookings.json");

  fs.writeFileSync(filePath, JSON.stringify(content), "utf-8");

  return filePath;
}

function createCabanas(): Cabana[] {
  return [
    {
      id: "cabana-1",
      x: 0,
      y: 0,
      isAvailable: true,
    },
    {
      id: "cabana-2",
      x: 2,
      y: 0,
      isAvailable: true,
    },
  ];
}

describe("BookingService", () => {
  let bookingService: BookingService;
  let cabanas: Cabana[];

  beforeEach(() => {
    const bookingsFilePath = createTempBookingsFile([
      { room: "101", guestName: "Alice Smith" },
      { room: "102", guestName: "Bob Jones" },
    ]);

    bookingService = new BookingService(bookingsFilePath);
    cabanas = createCabanas();
  });

  it("books a cabana when room number and guest name match a current guest", () => {
    const result = bookingService.bookCabana(
      "cabana-1",
      {
        roomNumber: "101",
        guestName: "Alice Smith",
      },
      cabanas,
    );

    expect(result).toEqual({
      success: true,
      message: "Cabana booked successfully.",
      cabana: {
        id: "cabana-1",
        isAvailable: false,
      },
    });
  });

  it("returns an error when cabana does not exist", () => {
    const result = bookingService.bookCabana(
      "cabana-999",
      {
        roomNumber: "101",
        guestName: "Alice Smith",
      },
      cabanas,
    );

    expect(result).toEqual({
      success: false,
      message: "Cabana not found.",
    });
  });

  it("returns an error when guest data does not match a current guest", () => {
    const result = bookingService.bookCabana(
      "cabana-1",
      {
        roomNumber: "101",
        guestName: "Wrong Name",
      },
      cabanas,
    );

    expect(result).toEqual({
      success: false,
      message: "Guest name and room number do not match a current guest.",
    });
  });

  it("returns an error when trying to book the same cabana twice", () => {
    bookingService.bookCabana(
      "cabana-1",
      {
        roomNumber: "101",
        guestName: "Alice Smith",
      },
      cabanas,
    );

    const secondResult = bookingService.bookCabana(
      "cabana-1",
      {
        roomNumber: "101",
        guestName: "Alice Smith",
      },
      cabanas,
    );

    expect(secondResult).toEqual({
      success: false,
      message: "This cabana is no longer available.",
    });
  });

  it("updates cabana availability after booking", () => {
    bookingService.bookCabana(
      "cabana-1",
      {
        roomNumber: "101",
        guestName: "Alice Smith",
      },
      cabanas,
    );

    const updatedCabanas = bookingService.mergeCabanaAvailability(cabanas);

    expect(updatedCabanas).toEqual([
      {
        id: "cabana-1",
        x: 0,
        y: 0,
        isAvailable: false,
      },
      {
        id: "cabana-2",
        x: 2,
        y: 0,
        isAvailable: true,
      },
    ]);
  });

  it("matches guest names case-insensitively and trims input", () => {
    const result = bookingService.bookCabana(
      "cabana-2",
      {
        roomNumber: "102 ",
        guestName: " bob jones ",
      },
      cabanas,
    );

    expect(result).toEqual({
      success: true,
      message: "Cabana booked successfully.",
      cabana: {
        id: "cabana-2",
        isAvailable: false,
      },
    });
  });
});
