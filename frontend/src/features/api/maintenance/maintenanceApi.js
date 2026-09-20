import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axios/axiosBaseQuery";

export const maintenanceApi = createApi({
  reducerPath: "maintenanceApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Maintenance"],

  endpoints: (builder) => ({
    getMaintenance: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/maintenance",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Maintenance"],
    }),
    createMaintenance: builder.mutation({
      query: (body) => ({
        url: "/maintenance",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Maintenance"],
    }),
  }),
});

export const {
  useCreateMaintenanceMutation,
  useGetMaintenanceQuery
} = maintenanceApi;
