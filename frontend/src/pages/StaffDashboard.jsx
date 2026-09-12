import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { useGetMyTasksQuery } from "../features/tasks/tasksApiSlice";
import { useGetMyPayslipsQuery } from "../features/payroll/payrollApiSlice";
import { LogOut, ListTodo, FileText, ArrowRight, LayoutGrid } from "lucide-react";

const StaffDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: myTasksData } = useGetMyTasksQuery();
  const { data: myPayslipsData } = useGetMyPayslipsQuery();

  const pendingTasks = myTasksData?.tasks?.filter(t => t.status !== "completed")?.length || 0;
  const totalPayslips = myPayslipsData?.payslips?.length || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <LayoutGrid className="h-5 w-5 text-indigo-600" strokeWidth={2.25} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Staff Portal</h1>
              <p className="text-sm text-slate-500">
                Welcome, {user?.name} <span className="text-slate-400">&middot;</span> {user?.position}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">My active tasks</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{pendingTasks}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <ListTodo size={22} className="text-blue-600" />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">Available payslips</p>
              <p className="mt-1 text-3xl font-semibold text-slate-900">{totalPayslips}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <FileText size={22} className="text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Link
            to="/tasks"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">My tasks</h2>
              <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </div>
            <p className="mt-1.5 text-sm text-slate-500">View assigned duties and update work status.</p>
          </Link>

          <Link
            to="/payroll"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">My payslips</h2>
              <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </div>
            <p className="mt-1.5 text-sm text-slate-500">Check monthly salary slips and payment status.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;