import { apiSlice } from "../../app/apiSlice";

export const payrollApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ================= STAFF =================

    getAllStaff: builder.query({
      query: () => "/users/staff",
    }),

    // ================= PAYROLL =================

    generatePayroll: builder.mutation({
      query: (payrollData) => ({
        url: "/payroll/generate",
        method: "POST",
        body: payrollData,
      }),
      invalidatesTags: ["Payroll"],
    }),

    getAllPayrolls: builder.query({
      query: () => "/payroll/all",
      providesTags: ["Payroll"],
    }),

    getMyPayslips: builder.query({
      query: () => "/payroll/my-payslips",
      providesTags: ["Payroll"],
    }),

    markAsPaid: builder.mutation({
      query: (payrollId) => ({
        url: `/payroll/${payrollId}/pay`,
        method: "PUT",
      }),
      invalidatesTags: ["Payroll"],
    }),
  }),
});

export const {
  useGetAllStaffQuery,
  useGeneratePayrollMutation,
  useGetAllPayrollsQuery,
  useGetMyPayslipsQuery,
  useMarkAsPaidMutation,
} = payrollApiSlice;