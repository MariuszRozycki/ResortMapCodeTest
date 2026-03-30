import BookingForm from "../BookingForm/BookingForm";
import type { Cabana } from "../../types/map";
import "./CabanaDetailsPanel.css";

type CabanaDetailsPanelProps = {
  selectedCabana: Cabana | null;
  roomNumber: string;
  guestName: string;
  bookingMessage: string | null;
  bookingError: string | null;
  isBooking: boolean;
  onRoomNumberChange: (value: string) => void;
  onGuestNameChange: (value: string) => void;
  onBook: () => void;
};

function CabanaDetailsPanel({
  selectedCabana,
  roomNumber,
  guestName,
  bookingMessage,
  bookingError,
  isBooking,
  onRoomNumberChange,
  onGuestNameChange,
  onBook,
}: CabanaDetailsPanelProps) {
  return (
    <section className="cabana-details-panel">
      <h2>Selected cabana</h2>

      {selectedCabana ? (
        <>
          <p>Cabana nr: {selectedCabana.id}</p>

          <p>
            <strong>Status:</strong>{" "}
            {selectedCabana.isAvailable ? "Available" : "Unavailable"}
          </p>

          {selectedCabana.isAvailable ? (
            <BookingForm
              roomNumber={roomNumber}
              guestName={guestName}
              isBooking={isBooking}
              onRoomNumberChange={onRoomNumberChange}
              onGuestNameChange={onGuestNameChange}
              onSubmit={onBook}
            />
          ) : (
            <p>This cabana is not available for booking.</p>
          )}

          {bookingMessage && <p>{bookingMessage}</p>}
          {bookingError && <p>{bookingError}</p>}
        </>
      ) : (
        <p>Click a cabana on the map to see details.</p>
      )}
    </section>
  );
}

export default CabanaDetailsPanel;
