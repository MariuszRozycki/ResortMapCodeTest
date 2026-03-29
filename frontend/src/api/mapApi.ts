import type { ResortMapResponse } from "../types/map";

const API_BASE_URL = "http://localhost:3000/api";

export async function fetchResortMap(): Promise<ResortMapResponse> {
  const response = await fetch(`${API_BASE_URL}/map`);

  if (!response.ok) {
    throw new Error("Failed to fetch resort map.");
  }

  const data: ResortMapResponse = await response.json();
  return data;
}
