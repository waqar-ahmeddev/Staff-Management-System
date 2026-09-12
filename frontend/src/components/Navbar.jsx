import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, logout } from "../features/auth/authSlice";
import { LogOut, User, LayoutGrid } from "lucide-react";

const Navbar = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
          <LayoutGrid size={16} className="text-white" strokeWidth={2.25} />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900">StaffOS</span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1 pl-1.5 pr-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100">
              <User size={13} className="text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium capitalize text-indigo-700">
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;