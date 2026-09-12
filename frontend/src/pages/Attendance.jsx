import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CalendarCheck,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

import { selectCurrentUser } from "../features/auth/authSlice";

import {
  useGetMyAttendanceQuery,
  useGetAllAttendanceQuery,
  useMarkAttendanceMutation,
} from "../features/attendance/attendanceApiSlice";

const Attendance = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");

  // Staff -> apni attendance
  const {
    data: myData,
    isLoading: myLoading,
    isError: myError,
  } = useGetMyAttendanceQuery(undefined, {
    skip: isAdmin,
  });

  // Admin -> tamam staff ki attendance
  const {
    data: allData,
    isLoading: allLoading,
    isError: allError,
  } = useGetAllAttendanceQuery(undefined, {
    skip: !isAdmin,
  });

  const [markAttendance, { isLoading: marking }] =
    useMarkAttendanceMutation();

  const myAttendance = myData?.attendance || [];

  // Admin ki apni attendance frontend par hide kar rahe hain
  const allAttendance = (allData?.attendance || []).filter(
    (item) => item.user?._id !== user?._id
  );

  const attendance = isAdmin ? allAttendance : myAttendance;

  const isLoading = isAdmin ? allLoading : myLoading;
  const isError = isAdmin ? allError : myError;

  const presentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "present"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "late"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "absent"
  ).length;

  const handleMarkAttendance = async () => {
    setMessage("");

    try {
      await markAttendance({ status }).unwrap();
      setMessage("Attendance marked successfully!");
    } catch (error) {
      setMessage(
        error?.data?.message || "Failed to mark attendance"
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
            Attendance
          </h1>

          <p className="mt-2 text-slate-500">
            {isAdmin
              ? "View attendance records of staff members."
              : "Track your daily attendance and attendance history."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {isAdmin ? "Total Records" : "My Records"}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {attendance.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                {isAdmin ? (
                  <Users size={24} />
                ) : (
                  <CalendarCheck size={24} />
                )}
              </div>
            </div>
          </div>

          {/* Present */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Present
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {presentCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

          {/* Late */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Late
                </p>

                <h2 className="mt-2 text-3xl font-bold text-orange-500">
                  {lateCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <Clock size={24} />
              </div>
            </div>
          </div>

          {/* Absent */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Absent
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-500">
                  {absentCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <XCircle size={24} />
              </div>
            </div>
          </div>

        </div>

        {/* Staff Only - Mark Attendance */}
        {!isAdmin && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Mark Today's Attendance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select your attendance status for today.
              </p>
            </div>

            <div className="p-6">

              <div className="grid gap-4 sm:grid-cols-3">

                {["Present", "Late", "Absent"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={`rounded-xl border p-4 text-left transition ${
                      status === item
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">

                      <div
                        className={`h-4 w-4 rounded-full ${
                          item === "Present"
                            ? "bg-green-500"
                            : item === "Late"
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                      />

                      <span className="font-semibold text-slate-800">
                        {item}
                      </span>

                    </div>
                  </button>
                ))}

              </div>

              {message && (
                <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {message}
                </div>
              )}

              <button
                onClick={handleMarkAttendance}
                disabled={marking}
                className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {marking
                  ? "Marking..."
                  : "Mark Attendance"}
              </button>

            </div>
          </div>
        )}

        {/* Attendance History */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              {isAdmin
                ? "Staff Attendance"
                : "My Attendance History"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isAdmin
                ? "Attendance records submitted by staff members."
                : "View your previous attendance records."}
            </p>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              Loading attendance...
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center gap-2 p-8 text-red-500">
              <AlertCircle size={20} />
              Failed to load attendance.
            </div>
          ) : attendance.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No attendance records found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-175">

                <thead className="bg-slate-50">
                  <tr>

                    {isAdmin && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Staff
                      </th>
                    )}

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Check In
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                      Reason
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {attendance.map((item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-slate-50"
                    >

                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.user?.name || "Unknown"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.user?.email || "-"}
                            </p>
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(
                          item.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {item.checkIn
                          ? new Date(
                              item.checkIn
                            ).toLocaleTimeString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status?.toLowerCase() ===
                            "present"
                              ? "bg-green-100 text-green-700"
                              : item.status?.toLowerCase() ===
                                "late"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.reason || "-"}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Attendance;

