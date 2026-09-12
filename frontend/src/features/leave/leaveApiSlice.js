import { apiSlice } from "../../app/apiSlice";

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Staff: Apply for leave
    applyLeave: builder.mutation({
      query: (leaveData) => ({
        url: "/leave/apply",
        method: "POST",
        body: leaveData,
      }),
      invalidatesTags: ["Leave"],
    }),

    // Staff: Get own leaves
    getMyLeaves: builder.query({
      query: () => "/leave/my-leaves",
      providesTags: ["Leave"],
    }),

    // Admin: Get all leave requests
    getAllLeaves: builder.query({
      query: () => "/leave/all-leaves",
      providesTags: ["Leave"],
    }),

    // Admin: Approve / Reject leave
    updateLeaveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/leave/update-status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Leave"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useApplyLeaveMutation,
  useGetMyLeavesQuery,
  useGetAllLeavesQuery,
  useUpdateLeaveStatusMutation,
} = leaveApiSlice;