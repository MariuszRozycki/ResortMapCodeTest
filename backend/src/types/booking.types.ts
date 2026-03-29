export type GuestBookingRecord = {
  room: string;
  guestName: string;
};

export type BookCabanaRequestBody = {
  roomNumber: string;
  guestName: string;
};

export type BookCabanaResult =
  | {
      success: true;
      message: string;
      cabana: {
        id: string;
        isAvailable: false;
      };
    }
  | {
      success: false;
      message: string;
    };
