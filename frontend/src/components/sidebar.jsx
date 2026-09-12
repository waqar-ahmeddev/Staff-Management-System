import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { LayoutDashboard, CheckSquare, DollarSign } from "lucide-react";

const Sidebar = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const dashboardPath = isAdmin ? "/admin/dashboard" : "/staff/dashboard";

  const links = [
    { name: "Dashboard", path: dashboardPath, icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Payroll", path: "/payroll", icon: DollarSign },
  ];

  return (
    <aside className="min-h-[calc(100vh-57px)] w-64 border-r border-slate-200 bg-white p-4">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
              )}
              <Icon
                size={18}
                className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}
              />
              {link.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;