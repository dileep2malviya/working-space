const getAllBookingStateSelector = (state) =>
  state.adminBookng?.getAllBookingState ?? null

const getBookingByIdSelector = (state, bookingId) => {
  const bookings = getAllBookingStateSelector(state);
  const bookingList = Array.isArray(bookings) ? bookings : bookings?.data;

  return bookingList?.find(
    (booking) => booking._id === bookingId || booking.id === bookingId
  ) ?? null;
};

export { getAllBookingStateSelector, getBookingByIdSelector }

