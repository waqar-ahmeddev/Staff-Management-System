import { apiSlice } from "../../app/apiSlice";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mark today's attendance
    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: "/attendance/mark",
        method: "POST",
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),

    // Get logged-in user's attendance
    getMyAttendance: builder.query({
      query: () => "/attendance/myattendance",
      providesTags: ["Attendance"],
    }),

    // Admin: Get all staff attendance
    getAllAttendance: builder.query({
      query: () => "/attendance/all",
      providesTags: ["Attendance"],
    }),

    // Admin: Get attendance by ID
    getAttendanceById: builder.query({
      query: (id) => `/attendance/${id}`,
      providesTags: ["Attendance"],
    }),

    // Admin: Update attendance
    updateAttendance: builder.mutation({
      query: ({ id, ...attendanceData }) => ({
        url: `/attendance/${id}`,
        method: "PUT",
        body: attendanceData,
      }),
      invalidatesTags: ["Attendance"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useMarkAttendanceMutation,
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useGetAttendanceByIdQuery,
  useUpdateAttendanceMutation,
} = attendanceApiSlice;