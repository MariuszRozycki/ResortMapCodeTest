import { useState, useEffect } from "react";
import { ResortMapGrid, CabanaDetailsPanel } from "./components";
import { fetchResortMap } from "./api/mapApi";
import { bookCabana } from "./api/bookingApi";
import type { ResortMapResponse, Cabana } from "./types/map";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState<ResortMapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    async function loadMap() {
      try {
        const data = await fetchResortMap();
        setMapData(data);
      } catch (err) {
        setError("Could not load resort map.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMap();
  }, []);

  async function handleBookCabana() {
    if (!selectedCabana) {
      return;
    }

    const trimmedRoomNumber = roomNumber.trim();
    const trimmedGuestName = guestName.trim();

    if (!trimmedRoomNumber || !trimmedGuestName) {
      setBookingError("Room number and guest name are required.");
      setBookingMessage(null);
      return;
    }

    setBookingError(null);
    setBookingMessage(null);
    setIsBooking(true);

    try {
      const result = await bookCabana(selectedCabana.id, {
        roomNumber: trimmedRoomNumber,
        guestName: trimmedGuestName,
      });

      setBookingMessage(result.message);

      const updatedMap = await fetchResortMap();
      setMapData(updatedMap);

      setRoomNumber("");
      setGuestName("");

      setTimeout(() => {
        setSelectedCabana(null);
        setBookingMessage(null);
      }, 2500);
    } catch (error) {
      if (error instanceof Error) {
        setBookingError(error.message);
      } else {
        setBookingError("Failed to book cabana.");
      }
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return <p>Loading map...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!mapData) {
    return <p>No map data available.</p>;
  }

  return (
    <main className="app">
      <h1>Resort Map</h1>

      <ResortMapGrid
        mapData={mapData}
        selectedCabana={selectedCabana}
        onCabanaSelect={(cabana) => {
          setSelectedCabana(cabana);
          setRoomNumber("");
          setGuestName("");
          setBookingMessage(null);
          setBookingError(null);
        }}
      />

      <CabanaDetailsPanel
        selectedCabana={selectedCabana}
        roomNumber={roomNumber}
        guestName={guestName}
        bookingMessage={bookingMessage}
        bookingError={bookingError}
        isBooking={isBooking}
        onRoomNumberChange={setRoomNumber}
        onGuestNameChange={setGuestName}
        onBook={handleBookCabana}
      />
    </main>
  );
}

export default App;
