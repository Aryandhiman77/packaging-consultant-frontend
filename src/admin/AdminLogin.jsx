import { useEffect, useState } from "react";
import "./AdminTheme.css";

import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";

import { useApi } from "../context/ApiContext";

export default function AdminLogin() {
  const { isAuthenticated, signIn } = useAdminAuth();

  const { loginAdmin } = useApi();

  const navigate = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(() => localStorage.getItem("admin-theme") === "dark");
  useEffect(() => { localStorage.setItem("admin-theme", dark ? "dark" : "light"); }, [dark]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await loginAdmin(email.trim(), password);
      signIn(result.token);

      setPassword("");

      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(
        err.status === 401
          ? "Incorrect email address or password."
          : err.status === 429
            ? "Too many login attempts. Please wait and try again."
            : err.status === 0
              ? "We could not connect to the admin service. Please try again in a moment."
              : "Unable to sign in right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className={`pc-admin ${dark ? "dark" : ""} relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff_0%,#f5f1ed_42%,#e8edf3_100%)] p-4`}>
      <button type="button" onClick={() => setDark(value => !value)} className="pc-action absolute right-6 top-6 px-4" aria-label={dark ? "Use light theme" : "Use dark theme"}>{dark ? "Light mode" : "Dark mode"}</button>
      <section className="w-full max-w-md rounded-3xl border border-white/80 bg-white/95 p-7 shadow-[0_24px_70px_rgba(22,32,48,.16)] sm:p-9">
        <div className="mb-7 flex items-center gap-4">
          <img
            src="/assets/site/header-mark-clean.png"
            alt="Packaging Consultants USA"
            className="h-14 w-auto object-contain"
          />
          <p className="text-sm font-black tracking-wide text-red-600 uppercase">
          Packaging Consultants USA
          </p>
        </div>

        <h1 className="text-3xl font-black text-[#201713]">Admin Login</h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in to manage navigation, settings and Project Reviews.
        </p>

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <label htmlFor="admin-email" className="block">
            <span className="mb-2 block text-xs font-black tracking-wider text-slate-600 uppercase">
              Email address
            </span>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </label>

          <label htmlFor="admin-password" className="block">
            <span className="mb-2 block text-xs font-black tracking-wider text-slate-600 uppercase">
              Password
            </span>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full rounded-xl bg-[#e51f32] px-4 py-3 text-sm font-black text-white shadow-[0_10px_25px_rgba(229,31,50,.22)] transition hover:bg-[#c91929] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
