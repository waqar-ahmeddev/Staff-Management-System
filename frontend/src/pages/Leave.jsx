import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { selectCurrentUser } from "../features/auth/authSlice";

import {
  useApplyLeaveMutation,
  useGetMyLeavesQuery,
  useGetAllLeavesQuery,
  useUpdateLeaveStatusMutation,
} from "../features/leave/leaveApiSlice";

const Leave = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");

  // Staff -> apni leaves
  const {
    data: myLeavesData,
    isLoading: myLoading,
    isError: myError,
  } = useGetMyLeavesQuery(undefined, {
    skip: isAdmin,
  });

  // Admin -> tamam staff leaves
  const {
    data: allLeavesData,
    isLoading: allLoading,
    isError: allError,
  } = useGetAllLeavesQuery(undefined, {
    skip: !isAdmin,
  });

  const [applyLeave, { isLoading: applying }] =
    useApplyLeaveMutation();

  const [updateLeaveStatus, { isLoading: updating }] =
    useUpdateLeaveStatusMutation();

  const myLeaves = Array.isArray(myLeavesData)
    ? myLeavesData
    : [];

  const allLeaves = Array.isArray(allLeavesData)
    ? allLeavesData.filter(
        (leave) => leave.user?._id !== user?._id
      )
    : [];

  const leaves = isAdmin ? allLeaves : myLeaves;

  const isLoading = isAdmin ? allLoading : myLoading;
  const isError = isAdmin ? allError : myError;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.endDate < form.startDate) {
      setMessage("End date cannot be before start date.");
      return;
    }

    try {
      await applyLeave(form).unwrap();

      setMessage(
        "Leave application submitted successfully!"
      );

      setForm({
        startDate: "",
        endDate: "",
        reason: "",
      });
    } catch (error) {
      setMessage(
        error?.data?.message ||
          "Failed to apply for leave"
      );
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setMessage("");

    try {
      await updateLeaveStatus({
        id,
        status,
      }).unwrap();

      setMessage(
        `Leave ${status} successfully!`
      );
    } catch (error) {
      setMessage(
        error?.data?.message ||
          "Failed to update leave status"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Staff Management System
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Leave Management
          </h1>

          <p className="mt-2 text-slate-500">
            {isAdmin
              ? "Review and manage staff leave requests."
              : "Apply for leave and track your requests."}
          </p>
        </div>

        {/* STAFF VIEW */}
        {!isAdmin && (
          <div className="grid gap-8 lg:grid-cols-[420px_1fr]">

            {/* Apply Leave */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Apply for Leave
                    </h2>

                    <p className="text-sm text-slate-500">
                      Submit a new leave request
                    </p>
                  </div>

                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Reason
                  </label>

                  <textarea
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Enter reason for your leave..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {message && (
                  <div className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={applying}
                  className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {applying
                    ? "Submitting..."
                    : "Submit Leave Request"}
                </button>

              </form>

            </div>

            {/* My Leave History */}
            <LeaveList
              leaves={leaves}
              isLoading={isLoading}
              isError={isError}
              isAdmin={false}
            />

          </div>
        )}

        {/* ADMIN VIEW */}
        {isAdmin && (
          <div className="space-y-6">

            {message && (
              <div className="rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                {message}
              </div>
            )}

            <LeaveList
              leaves={leaves}
              isLoading={isLoading}
              isError={isError}
              isAdmin={true}
              onUpdateStatus={handleStatusUpdate}
              updating={updating}
            />

          </div>
        )}

      </div>
    </div>
  );
};


/* --------------------------------
   Leave List Component
-------------------------------- */

const LeaveList = ({
  leaves,
  isLoading,
  isError,
  isAdmin,
  onUpdateStatus,
  updating,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 p-6">

        <h2 className="text-xl font-bold text-slate-900">
          {isAdmin
            ? "Staff Leave Requests"
            : "My Leave Requests"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Review leave requests submitted by staff."
            : "View the status of your submitted requests."}
        </p>

      </div>

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">
          Loading leave requests...
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center gap-2 p-8 text-red-500">
          <AlertCircle size={20} />
          Failed to load leave requests.
        </div>
      ) : leaves.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          No leave requests found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">

          {leaves.map((leave) => (

            <div
              key={leave._id}
              className="p-6 transition hover:bg-slate-50"
            >

              <div className="flex flex-col gap-5">

                {/* Top */}
                <div className="flex flex-col justify-between gap-4 md:flex-row">

                  <div>

                    {isAdmin && (
                      <div className="mb-3">

                        <h3 className="text-lg font-bold text-slate-900">
                          {leave.user?.name ||
                            "Unknown Staff"}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {leave.user?.email || "-"}
                        </p>

                      </div>
                    )}

                    {!isAdmin && (
                      <h3 className="text-lg font-bold text-slate-900">
                        Leave Request
                      </h3>
                    )}

                    {/* Dates */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">

                      <span className="flex items-center gap-1">
                        <CalendarDays size={16} />

                        {new Date(
                          leave.startDate
                        ).toLocaleDateString()}
                      </span>

                      <span>→</span>

                      <span className="flex items-center gap-1">
                        <CalendarDays size={16} />

                        {new Date(
                          leave.endDate
                        ).toLocaleDateString()}
                      </span>

                    </div>

                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        leave.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : leave.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {leave.status === "approved" && (
                        <CheckCircle size={14} />
                      )}

                      {leave.status === "rejected" && (
                        <XCircle size={14} />
                      )}

                      {leave.status === "pending" && (
                        <Clock size={14} />
                      )}

                      {leave.status}
                    </span>
                  </div>

                </div>

                {/* Reason */}
                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reason
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {leave.reason}
                  </p>

                </div>

                {/* Admin Actions */}
                {isAdmin && leave.status === "pending" && (
                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          leave._id,
                          "approved"
                        )
                      }
                      disabled={updating}
                      className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        onUpdateStatus(
                          leave._id,
                          "rejected"
                        )
                      }
                      disabled={updating}
                      className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updating
                        ? "Updating..."
                        : "Reject"}
                    </button>

                  </div>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Leave;
