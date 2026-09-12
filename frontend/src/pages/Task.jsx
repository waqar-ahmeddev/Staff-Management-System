import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import {
  useGetTasksQuery,
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation
} from "../features/tasks/tasksApiSlice";

const Tasks = () => {
  const user = useSelector(selectCurrentUser);
  const isAdmin = user?.role === "admin";

  const adminTasksQuery = useGetTasksQuery(undefined, { skip: !isAdmin });
  const staffTasksQuery = useGetMyTasksQuery(undefined, { skip: isAdmin });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const { data, isLoading } = isAdmin ? adminTasksQuery : staffTasksQuery;

  // Form State (Admin Only)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask({ title, description, assignedTo, deadline }).unwrap();
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDeadline("");
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2.5 text-sm font-medium text-slate-500">
          <svg className="h-4 w-4 animate-spin text-indigo-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading tasks...
        </div>
      </div>
    );
  }

  const taskList = data?.tasks || [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">
          {isAdmin ? "Task assignment & management" : "My assigned tasks"}
        </h1>

        {/* Admin Task Creation Form */}
        {isAdmin && (
          <form onSubmit={handleCreateTask} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">Assign new task</h2>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <input
                type="text"
                placeholder="Assigned staff Mongo user ID"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <input
                type="text"
                placeholder="Task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create task"}
            </button>
          </form>
        )}

        {/* Task List Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {taskList.map((task) => (
            <div key={task._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">{task.title}</h3>
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                    task.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {task.status.toUpperCase()}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">{task.description}</p>
              <p className="mb-4 text-xs text-slate-400">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                {!isAdmin ? (
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus({ taskId: task._id, status: e.target.value })}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="pending font-semibold">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : (
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-xs font-medium text-red-600 transition hover:text-red-700 hover:underline"
                  >
                    Delete task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;