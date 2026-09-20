import { createSlice } from "@reduxjs/toolkit";
import { create } from "axios";

const initialState = {
	bookings: [],
};

const bookingMemberSlice = createSlice({
	name: "bookingMember",
	initialState,
	reducers: {
		setMemberBookings: (state, action) => {
			state.bookings = action.payload?.data ?? [];
		},
		updateMemberBooking: (state, action) => {
			const { id, booking } = action.payload;
			const index = state.bookings.findIndex(
				(item) => item._id === id || item.id === id
			);

			if (index !== -1) state.bookings[index] = booking;
		},
	},
});

export const { setMemberBookings, updateMemberBooking } = bookingMemberSlice.actions;

export default bookingMemberSlice.reducer;
