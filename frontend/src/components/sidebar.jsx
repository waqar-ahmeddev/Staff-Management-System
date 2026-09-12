import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  CalendarCheck,
  CalendarDays,
  Bell,
  Users,
  UserCog,
  ClipboardList,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/staff/dashboard";

  // ================= SIDEBAR LINKS =================

  const mainLinks = [
    {
      name: "Dashboard",
      path: dashboardPath,
      icon: LayoutDashboard,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Leave",
      path: "/leave",
      icon: CalendarDays,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Payroll",
      path: "/payroll",
      icon: DollarSign,
    },
  ];

  // Admin-only links
  const adminLinks = [
    {
      name: "Staff Management",
      path: "/admin/staff",
      icon: Users,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: ClipboardList,
    },
  ];

  return (
    <aside className="min-h-[calc(100vh-57px)] w-64 border-r border-slate-200 bg-white p-4">

      {/* ================= USER INFO ================= */}
      <div className="mb-6 rounded-xl bg-slate-50 p-3">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>

            <p className="text-xs capitalize text-slate-500">
              {user?.role || "Staff"}
            </p>
          </div>

        </div>
      </div>

      {/* ================= MAIN MENU ================= */}
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Main Menu
      </p>

      <div className="space-y-1">

        {mainLinks.map((link) => {
          const Icon = link.icon;

          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />

              <span>{link.name}</span>

            </Link>
          );
        })}

      </div>

      {/* ================= ADMIN MENU ================= */}
      {isAdmin && (
        <div className="mt-7">

          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Administration
          </p>

          <div className="space-y-1">

            {adminLinks.map((link) => {
              const Icon = link.icon;

              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >

                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }
                  />

                  <span>{link.name}</span>

                </Link>
              );
            })}

          </div>

        </div>
      )}

      {/* ================= BOTTOM ================= */}
      <div className="mt-8 border-t border-slate-100 pt-4">

        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-500">
          <UserCog size={18} />
          <span className="capitalize">
            {isAdmin ? "Administrator" : "Staff Member"}
          </span>
        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
