import { apiSlice } from "../../app/apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin + Staff: Get all notices
    getAllNotices: builder.query({
      query: () => "/notifications",
      providesTags: ["Notification"],
    }),

    // Staff: Get department-specific notices
    getMyDepartmentNotices: builder.query({
      query: () => "/notifications/my-department",
      providesTags: ["Notification"],
    }),

    // Admin: Create notice
    createNotice: builder.mutation({
      query: (noticeData) => ({
        url: "/notifications",
        method: "POST",
        body: noticeData,
      }),
      invalidatesTags: ["Notification"],
    }),

    // Admin: Delete notice
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllNoticesQuery,
  useGetMyDepartmentNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
} = notificationApiSlice;