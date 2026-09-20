const getMemberBookingsSelector = (state) =>
	state.bookingMember?.bookings ?? [];

export { getMemberBookingsSelector };
