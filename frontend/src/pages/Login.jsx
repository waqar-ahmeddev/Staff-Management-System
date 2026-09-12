import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Users, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // UI-only, does not affect auth logic

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Purana error clear karein

    try {
      // 1. Backend ko login request bhejein
      const userData = await login({ email, password }).unwrap();

      // 2. Redux state aur LocalStorage/Cookies update karein
      dispatch(setCredentials({ ...userData }));

      // 3. Role ke mutabiq Navigation karein
      const role = userData?.user?.role;

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "staff") {
        navigate("/staff/dashboard", { replace: true });
      } else {
        // Fallback option agar role missing ho
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Backend error message extract karein
      const msg = err?.data?.message || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0e1a] flex items-center justify-center p-4 sm:p-6">
      {/* Ambient glow layers */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-11228rem] rounded-full bg-indigo-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-[24rem] rounded-full bg-blue-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-88 w-88 rounded-full bg-purple-600/20 blur-[110px]" />

      {/* Faint grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)] border border-white/10">
        {/* Left brand panel */}
        <div className="hidden lg:flex relative flex-col justify-between bg-linear-to-br from-[#111832] via-[#141b3d] to-[#1c1440] p-10 xl:p-12">
          <div className="pointer-events-none absolute -top-10 -left-10 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-10 right-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-900/40">
                <Users className="h-5 w-5 text-white" strokeWidth={2.25} />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Staff Management System
              </span>
            </div>

            <h1 className="mt-14 text-3xl xl:text-[2.25rem] leading-tight font-semibold text-white max-w-sm">
              Keep every team, shift and record in one place.
            </h1>
            <p className="mt-4 text-sm text-slate-400 max-w-xs leading-relaxed">
              Sign in to manage staff records, attendance and permissions from a single, secure dashboard.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span>Access is encrypted and limited to authorized staff.</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-900/20">
              <Users className="h-5 w-5 text-white" strokeWidth={2.25} />
            </div>
            <span className="text-slate-900 font-semibold text-lg tracking-tight">
              Staff Management System
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ahmad@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10.5 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3 pl-10.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4.5 w-4.5 animate-spin text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Protected access &middot; Staff Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;