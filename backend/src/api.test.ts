import fs from "fs";
import os from "os";
import path from "path";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { createApp } from "./app";
import { CliConfig } from "./config/cli";

function createTempFile(fileName: string, content: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "resort-api-test-"));
  const filePath = path.join(tempDir, fileName);

  fs.writeFileSync(filePath, content, "utf-8");

  return filePath;
}

describe("Resort Map API", () => {
  let config: CliConfig;

  beforeAll(() => {
    const mapPath = createTempFile(
      "map.ascii",
      `
W#W
.p.
c..
      `.trim(),
    );

    const bookingsFilePath = createTempFile(
      "bookings.json",
      JSON.stringify([
        { room: "101", guestName: "Alice Smith" },
        { room: "102", guestName: "Bob Jones" },
      ]),
    );

    config = {
      mapPath,
      bookingsFilePath,
    };
  });

  it("returns health status", async () => {
    const app = createApp(config);

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
    });
  });

  it("returns resort map data", async () => {
    const app = createApp(config);

    const response = await request(app).get("/api/map");

    expect(response.status).toBe(200);
    expect(response.body.rows).toBe(3);
    expect(response.body.cols).toBe(3);
    expect(response.body.tiles).toHaveLength(9);
    expect(response.body.cabanas).toHaveLength(2);
  });

  it("returns 400 when room number or guest name is missing", async () => {
    const app = createApp(config);

    const response = await request(app)
      .post("/api/cabanas/cabana-1/book")
      .send({
        roomNumber: "",
        guestName: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Room number and guest name are required.",
    });
  });

  it("returns 404 when cabana does not exist", async () => {
    const app = createApp(config);

    const response = await request(app)
      .post("/api/cabanas/cabana-999/book")
      .send({
        roomNumber: "101",
        guestName: "Alice Smith",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: "Cabana not found.",
    });
  });

  it("returns 400 when guest data does not match a current guest", async () => {
    const app = createApp(config);

    const response = await request(app)
      .post("/api/cabanas/cabana-1/book")
      .send({
        roomNumber: "101",
        guestName: "Wrong Name",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Guest name and room number do not match a current guest.",
    });
  });

  it("books a cabana successfully", async () => {
    const app = createApp(config);

    const response = await request(app)
      .post("/api/cabanas/cabana-1/book")
      .send({
        roomNumber: "101",
        guestName: "Alice Smith",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Cabana booked successfully.",
      cabana: {
        id: "cabana-1",
        isAvailable: false,
      },
    });
  });

  it("returns 409 when trying to book the same cabana twice", async () => {
    const app = createApp(config);

    await request(app).post("/api/cabanas/cabana-2/book").send({
      roomNumber: "102",
      guestName: "Bob Jones",
    });

    const secondResponse = await request(app)
      .post("/api/cabanas/cabana-2/book")
      .send({
        roomNumber: "102",
        guestName: "Bob Jones",
      });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body).toEqual({
      success: false,
      message: "This cabana is no longer available.",
    });
  });

  it("updates map availability after a successful booking", async () => {
    const app = createApp(config);

    await request(app).post("/api/cabanas/cabana-1/book").send({
      roomNumber: "101",
      guestName: "Alice Smith",
    });

    const mapResponse = await request(app).get("/api/map");

    const bookedCabana = mapResponse.body.cabanas.find(
      (cabana: { id: string; isAvailable: boolean }) =>
        cabana.id === "cabana-1",
    );

    expect(bookedCabana).toEqual({
      id: "cabana-1",
      x: 0,
      y: 0,
      isAvailable: false,
    });
  });
});
