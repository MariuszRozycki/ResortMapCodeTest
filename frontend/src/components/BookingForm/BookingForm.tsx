import "./BookingForm.css";

type BookingFormProps = {
  roomNumber: string;
  guestName: string;
  isBooking: boolean;
  onRoomNumberChange: (value: string) => void;
  onGuestNameChange: (value: string) => void;
  onSubmit: () => void;
};

function BookingForm({
  roomNumber,
  guestName,
  isBooking,
  onRoomNumberChange,
  onGuestNameChange,
  onSubmit,
}: BookingFormProps) {
  return (
    <div className="booking-form">
      <h3>Book this cabana</h3>

      <label>
        Room number
        <input
          type="text"
          value={roomNumber}
          onChange={(event) => onRoomNumberChange(event.target.value)}
        />
      </label>

      <label>
        Guest name
        <input
          type="text"
          value={guestName}
          onChange={(event) => onGuestNameChange(event.target.value)}
        />
      </label>

      <button type="button" onClick={onSubmit} disabled={isBooking}>
        {isBooking ? "Booking..." : "Book cabana"}
      </button>
    </div>
  );
}

export default BookingForm;
