import type { BookCabanaPayload, BookCabanaResponse } from "../types/booking";

export async function bookCabana(
  cabanaId: string,
  payload: BookCabanaPayload,
): Promise<BookCabanaResponse> {
  const response = await fetch(
    `http://localhost:3000/api/cabanas/${cabanaId}/book`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const data = (await response.json()) as BookCabanaResponse;

  if (!response.ok) {
    throw new Error(data.message || "Failed to book cabana.");
  }

  return data;
}
