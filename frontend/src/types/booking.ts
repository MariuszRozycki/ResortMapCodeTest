export type BookCabanaPayload = {
  roomNumber: string;
  guestName: string;
};

export type BookCabanaResponse = {
  success: boolean;
  message: string;
  cabana?: {
    id: string;
    isAvailable: boolean;
  };
};
