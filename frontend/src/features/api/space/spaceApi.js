import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const spaceApi = createApi({
  reducerPath: "spaceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User"],

  endpoints: (builder) => ({
    createSpace: builder.mutation({
      query: (body) => ({
        url: "/space",
        method: "POST",
        data: body,
      }),
    }),
    getAllSpace: builder.mutation({
      query: ({ page = 1, limit = 10, date } = {}) => ({
        url: "/space",
        method: "GET",
        params: {
          page,
          limit,
          date,
        },
      }),
    }),
    updateSpace: builder.mutation({
      query: ({ id, body }) => ({
        url: `/space/update/${id}`,
        method: "PATCH",
        data: body,
      }),
    }),
    getSpaceDropDown: builder.mutation({
      query: () => ({
        url: `/space/dropdown`,
        method: "GET",
      }),
    }),
    getSpaceDetails: builder.mutation({
      query: ({ id, date }) => ({
        url: `/space/space-details/${id}`,
        method: "GET",
        params: { date },
      }),
    }),
  }),
});

export const {
  useGetAllSpaceMutation,
  useCreateSpaceMutation,
  useUpdateSpaceMutation,
  useGetSpaceDropDownMutation,
  useGetSpaceDetailsMutation,
} = spaceApi;

