import { createSlice } from "@reduxjs/toolkit";
import { create } from "axios";

const initialState = {
    getAllBookingState: null,
};

const bookingAdminSlice = createSlice({
    name: "bookingAdmin",
    initialState,
    reducers: {
        setGetAllBooking: (state, action) => {
            state.getAllBookingState = action.payload?.data ?? action.payload ?? []
        },
        updateBookingStatus: (state, action) => {
            const { id, status } = action.payload;
            const bookings = Array.isArray(state.getAllBookingState)
                ? state.getAllBookingState
                : state.getAllBookingState?.data;

            if (!Array.isArray(bookings)) return;

            const booking = bookings.find(
                (item) => item._id === id || item.id === id
            );

            if (booking) booking.status = status;
        },
    }
})

export const {
    setGetAllBooking,
    createBooking,
    updateBookingStatus,
} = bookingAdminSlice.actions;

export default bookingAdminSlice.reducer;

