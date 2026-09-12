import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { useGetTasksQuery } from "../features/tasks/tasksApiSlice";
import { useGetAllPayrollsQuery } from "../features/payroll/payrollApiSlice";
import { LogOut, CheckSquare, DollarSign, Users } from "lucide-react";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery();
  const { data: payrollData, isLoading: payrollLoading } = useGetAllPayrollsQuery();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const totalTasks = tasksData?.tasks?.length || 0;
  const pendingPayroll = payrollData?.payrolls?.filter(p => p.status === "pending")?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total System Tasks</p>
            <p className="text-3xl font-bold text-gray-800">{tasksLoading ? "..." : totalTasks}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <CheckSquare size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Payrolls</p>
            <p className="text-3xl font-bold text-amber-600">{payrollLoading ? "..." : pendingPayroll}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Department</p>
            <p className="text-xl font-bold text-gray-800">{user?.department || "Management"}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/tasks" className="p-6 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Task Management →</h2>
          <p className="text-gray-600 text-sm">Assign new tasks to staff and monitor overall project progress.</p>
        </Link>

        <Link to="/payroll" className="p-6 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Automated Payroll →</h2>
          <p className="text-gray-600 text-sm">Generate monthly payslips and process staff salary payments.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;