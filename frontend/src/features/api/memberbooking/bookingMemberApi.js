import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const bookingMemberApi = createApi({
	reducerPath: "bookingMemberApi",
	baseQuery: axiosBaseQuery(),
	tagTypes: ["MemberBooking"],

	endpoints: (builder) => ({
		getMemberBookings: builder.mutation({
			query: (params = {}) => ({
				url: "/booking",
				method: "GET",
				params,
			}),
			providesTags: ["MemberBooking"],
		}),
		createMemberBooking: builder.mutation({
			query: (body) => ({
				url: "/booking",
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["MemberBooking"],
		}),
		updateMemberBooking: builder.mutation({
			query: ({ id, body }) => ({
				url: `/booking/update/${id}`,
				method: "PATCH",
				data: body,
			}),
			invalidatesTags: ["MemberBooking"],
		}),
		cancelMemberBooking: builder.mutation({
			query: (id) => ({
				url: `/booking/cancel/${id}`,
				method: "PATCH",
			}),
			invalidatesTags: ["MemberBooking"],
		}),
	}),
});

export const {
	useGetMemberBookingsMutation,
	useCreateMemberBookingMutation,
	useUpdateMemberBookingMutation,
	useCancelMemberBookingMutation,
} = bookingMemberApi;
