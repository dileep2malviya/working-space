import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const bookingAdminApi = createApi({
  reducerPath: "bookingAdmiApi",
  baseQuery: axiosBaseQuery(),

  endpoints: (builder) => ({

    getAllBooking: builder.mutation({
      query: (body) => ({
        url: "/booking",
        method: "GET",
        data: body,
      }),
    }),

    approveBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/${id}/approve`,
        method: "PATCH",
      }),
    }),

    rejectBooking: builder.mutation({
      query: (id) => ({
        url: `/booking/${id}/reject`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetAllBookingMutation,
  useApproveBookingMutation,
  useRejectBookingMutation,
} = bookingAdminApi;

