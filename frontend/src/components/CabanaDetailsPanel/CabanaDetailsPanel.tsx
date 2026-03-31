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
    <section className="cabana-details-panel" aria-live="polite">
      <h2>Selected cabana</h2>

      {selectedCabana ? (
        <>
          <p>Cabana: {selectedCabana.id}</p>

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

          {bookingMessage && (
            <p className="cabana-details-success">{bookingMessage}</p>
          )}
          {bookingError && (
            <p className="cabana-details-error">{bookingError}</p>
          )}
        </>
      ) : (
        <>
          {bookingMessage && (
            <p className="cabana-details-success">{bookingMessage}</p>
          )}
          {bookingError && (
            <p className="cabana-details-error">{bookingError}</p>
          )}
          <p>Click an available cabana on the map to book it.</p>
        </>
      )}
    </section>
  );
}

export default CabanaDetailsPanel;
