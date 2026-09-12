import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Notifications from "./pages/Notifications";
import Tasks from "./pages/Task";
import Payroll from "./pages/payroll";

// Protected Route Guard
const ProtectedRoute = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Main Layout
const MainLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
          <Route element={<MainLayout />}>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Staff Routes */}
            <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
            </Route>

            {/* Shared Routes */}
            <Route path="/attendance" element={<Attendance />} />

            <Route path="/leave" element={<Leave />} />

            <Route path="/notifications" element={<Notifications />} />

            <Route path="/tasks" element={<Tasks />} />

            <Route path="/payroll" element={<Payroll />} />
          </Route>
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
