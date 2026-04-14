import type { BookCabanaPayload, BookCabanaResponse } from "../types/booking";
import { API_BASE_URL } from "./config";

export async function bookCabana(
  cabanaId: string,
  payload: BookCabanaPayload,
): Promise<BookCabanaResponse> {
  const response = await fetch(`${API_BASE_URL}/cabanas/${cabanaId}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as BookCabanaResponse;

  if (!response.ok) {
    throw new Error(data.message || "Failed to book cabana.");
  }

  return data;
}
