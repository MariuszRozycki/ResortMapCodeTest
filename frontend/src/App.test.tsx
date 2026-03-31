import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.restoreAllMocks();
});

const mockMapResponse = {
  rows: 2,
  cols: 2,
  tiles: [
    { x: 0, y: 0, type: "cabana" },
    { x: 1, y: 0, type: "pool" },
    { x: 0, y: 1, type: "path" },
    { x: 1, y: 1, type: "empty" },
  ],
  cabanas: [
    {
      id: "cabana-1",
      x: 0,
      y: 0,
      roomNumber: "101",
      isAvailable: true,
    },
  ],
};

describe("App", () => {
  it("shows the booking form when the user clicks an available cabana", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockMapResponse,
    } as Response);

    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    const cabanaButton = await screen.findByRole("button", {
      name: /cabana/i,
    });

    await user.click(cabanaButton);

    expect(screen.getByLabelText(/room number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guest name/i)).toBeInTheDocument();
  });

  it("submits a booking successfully and shows confirmation", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMapResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Cabana booked successfully",
        }),
      } as Response);

    const user = userEvent.setup();

    render(<App />);

    const cabanaButton = await screen.findByRole("button", {
      name: /cabana/i,
    });

    await user.click(cabanaButton);

    await user.type(screen.getByLabelText(/room number/i), "101");
    await user.type(screen.getByLabelText(/guest name/i), "Alice Smith");

    await user.click(screen.getByRole("button", { name: /book/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/book/i),
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("shows unavailable information when the user clicks a booked cabana", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        rows: 2,
        cols: 2,
        tiles: [
          { x: 0, y: 0, type: "cabana" },
          { x: 1, y: 0, type: "pool" },
        ],
        cabanas: [
          {
            id: "cabana-1",
            x: 0,
            y: 0,
            roomNumber: "101",
            isAvailable: false,
          },
        ],
      }),
    } as Response);

    const user = userEvent.setup();

    render(<App />);

    const cabanaButton = await screen.findByRole("button", {
      name: /cabana/i,
    });

    await user.click(cabanaButton);

    expect(
      screen.getByText(/This cabana is not available for booking./i),
    ).toBeInTheDocument();
  });

  it("shows an error message when booking fails", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockMapResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Invalid room number or guest name",
        }),
      } as Response);

    const user = userEvent.setup();

    render(<App />);

    const cabanaButton = await screen.findByRole("button", {
      name: /cabana/i,
    });

    await user.click(cabanaButton);

    await user.type(screen.getByLabelText(/room number/i), "999");
    await user.type(screen.getByLabelText(/guest name/i), "Wrong Person");

    await user.click(screen.getByRole("button", { name: /book/i }));

    expect(
      await screen.findByText(
        /Guest name and room number do not match|Room number and guest name are required|Invalid room number or guest name/i,
      ),
    ).toBeInTheDocument();
  });

  it("updates cabana status on the map after a successful booking", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const initialMapResponse = {
      rows: 2,
      cols: 2,
      tiles: [
        { x: 0, y: 0, type: "cabana" },
        { x: 1, y: 0, type: "pool" },
      ],
      cabanas: [
        {
          id: "cabana-1",
          x: 0,
          y: 0,
          roomNumber: "101",
          isAvailable: true,
        },
      ],
    };

    const updatedMapResponse = {
      rows: 2,
      cols: 2,
      tiles: [
        { x: 0, y: 0, type: "cabana" },
        { x: 1, y: 0, type: "pool" },
      ],
      cabanas: [
        {
          id: "cabana-1",
          x: 0,
          y: 0,
          roomNumber: "101",
          isAvailable: false,
        },
      ],
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => initialMapResponse,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Cabana booked successfully",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => updatedMapResponse,
      } as Response);

    const user = userEvent.setup();

    render(<App />);

    const cabanaButton = await screen.findByRole("button", {
      name: /cabana/i,
    });

    await user.click(cabanaButton);

    await user.type(screen.getByLabelText(/room number/i), "101");
    await user.type(screen.getByLabelText(/guest name/i), "Alice Smith");

    await user.click(screen.getByRole("button", { name: /book/i }));

    expect(
      await screen.findByText(
        /Cabana booked successfully. Returning to the map view|Click an available cabana on the map to book it./i,
      ),
    ).toBeInTheDocument();
  });
});
