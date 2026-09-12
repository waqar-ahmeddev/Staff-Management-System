import { useState } from "react";
import {
  useGetMyDepartmentNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
} from "../features/notification/notificationsApiSlice";

const Notifications = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDepartment: "All",
    priority: "Normal",
  });

  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAdmin = user?.role === "admin";

  const {
    data,
    isLoading,
    isError,
  } = useGetMyDepartmentNoticesQuery();

  const [createNotice, { isLoading: creating }] =
    useCreateNoticeMutation();

  const [deleteNotice, { isLoading: deleting }] =
    useDeleteNoticeMutation();

  const notices = Array.isArray(data) ? data : [];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createNotice(form).unwrap();

      setMessage("Notice created successfully!");

      setForm({
        title: "",
        description: "",
        targetDepartment: "All",
        priority: "Normal",
      });
    } catch (error) {
      setMessage(
        error?.data?.message || "Failed to create notice"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      await deleteNotice(id).unwrap();
    } catch (error) {
      setMessage(
        error?.data?.message || "Failed to delete notice"
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
            Notifications
          </h1>

          <p className="mt-2 text-slate-500">
            Stay updated with the latest announcements.
          </p>
        </div>

        {/* Admin Create Notice */}
        {isAdmin && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Create New Notice
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Publish an announcement for staff members.
              </p>
            </div>

            <form
              onSubmit={handleCreate}
              className="grid gap-5 p-6 md:grid-cols-2"
            >

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notice Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter notice title"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Write your announcement..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department
                </label>

                <select
                  name="targetDepartment"
                  value={form.targetDepartment}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="All">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              {message && (
                <div className="md:col-span-2 rounded-xl bg-blue-50 p-4 text-sm font-medium text-blue-700">
                  {message}
                </div>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Publishing..." : "Publish Notice"}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Notices */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Latest Announcements
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Important updates from your organization.
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            {notices.length} Notices
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            Loading notifications...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center text-red-600">
            Failed to load notifications.
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="text-5xl">🔔</div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              There are no announcements available right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {notices.map((notice) => (
              <div
                key={notice._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div
                  className={`h-1 w-full ${
                    notice.priority === "Urgent"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                />

                <div className="p-6">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl">
                      🔔
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        notice.priority === "Urgent"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {notice.priority}
                    </span>

                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {notice.title}
                  </h3>

                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                    {notice.description}
                  </p>

                  <div className="mt-6 border-t border-slate-100 pt-4">

                    <div className="flex items-center justify-between text-xs text-slate-400">

                      <span>
                        📢 {notice.targetDepartment}
                      </span>

                      <span>
                        {notice.createdAt
                          ? new Date(
                              notice.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>

                    {notice.postedBy && (
                      <p className="mt-2 text-xs text-slate-400">
                        Posted by{" "}
                        <span className="font-semibold text-slate-600">
                          {notice.postedBy.name}
                        </span>
                      </p>
                    )}

                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(notice._id)}
                      disabled={deleting}
                      className="mt-5 w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete Notice
                    </button>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;