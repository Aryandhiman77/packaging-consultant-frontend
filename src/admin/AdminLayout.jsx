import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";
import "./AdminTheme.css";

function Icon({ name }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    reviews: (
      <>
        <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
        <path d="M14 3.5V8h4.5M9 12h6M9 15.5h6M9 19h4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.16.37.37.7.64.98.28.27.62.42.96.42h.1v4H21a1.7 1.7 0 0 0-1.6.6Z" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-[#e82634] text-white shadow-[0_8px_22px_rgba(232,38,52,.22)]"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/[.07] dark:hover:text-white"
  }`;

function ThemeIcon({ dark }) {
  return dark ? (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8Z" />
    </svg>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  const { signOut, expiresAt } = useAdminAuth();

  const logout = () => {
    signOut();

    navigate("/admin/login", {
      replace: true,
    });
  };

  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("admin-theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("admin-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div
      className={`pc-admin ${dark ? "dark" : ""} min-h-screen bg-[#edf2f8] font-sans text-slate-900 transition-colors duration-300 dark:bg-[#263349] dark:text-slate-100`}
    >
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 transition-colors duration-300 lg:flex lg:flex-col dark:border-white/[.08] dark:bg-[#303f55]">
        <Link
          to="/"
          className="flex items-center gap-3 px-2 !text-slate-950 no-underline dark:!text-white"
        >
          <img
            src="/assets/site/header-mark-clean.png"
            alt=""
            className="h-10 w-20 object-contain"
          />
          <span className="leading-tight">
            <strong className="block text-sm">Packaging Consultants</strong>
            <small className="text-[11px] font-semibold tracking-[.12em] text-slate-400 uppercase dark:text-slate-500">
              Admin panel
            </small>
          </span>
        </Link>

        <nav className="mt-9 grid gap-1.5" aria-label="Admin navigation">
          <NavLink end to="/admin" className={navClass}>
            <Icon name="dashboard" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/project-reviews" className={navClass}>
            <Icon name="reviews" />
            Project Reviews
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Icon name="settings" />
            Navigation & Dropdowns
          </NavLink>
          <NavLink to="/admin/cms" className={navClass}>
            <Icon name="reviews" />
            Content CMS
          </NavLink>
          <NavLink to="/admin/blogs" className={navClass}>
            <Icon name="reviews" />
            Blog Posts
          </NavLink>
          <NavLink to="/admin/site-content" className={navClass}>
            <Icon name="settings" />
            Home & Footer
          </NavLink>

          <NavLink to="/admin/contact-messages" className={navClass}>
            <Icon name="reviews" />
            Contact Messages
          </NavLink>
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/[.09] dark:bg-white/[.035]">
          <p className="text-xs font-bold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Authentication
          </p>

          <p className="mt-2 text-sm text-slate-500">Session expires at:</p>

          <p className="mt-1 text-xs text-slate-500">
            {new Date(expiresAt).toLocaleString()}
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 font-bold text-white"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur transition-colors duration-300 sm:px-7 dark:border-white/[.08] dark:bg-[#303f55]/95">
          <div>
            <p className="text-xs font-bold tracking-[.16em] text-slate-400 uppercase dark:text-slate-500">
              Site administration
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Packaging Consultants USA
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDark((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/[.1] dark:bg-white/[.06] dark:text-amber-300 dark:hover:bg-white/[.1]"
              aria-label={dark ? "Use light mode" : "Use dark mode"}
              title={dark ? "Use light mode" : "Use dark mode"}
            >
              <ThemeIcon dark={dark} />
            </button>
            <Link
              to="/"
              className="hidden rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold !text-slate-700 no-underline shadow-sm hover:bg-slate-50 sm:inline-flex dark:border-white/[.1] dark:bg-white/[.06] dark:!text-slate-200 dark:hover:bg-white/[.1]"
            >
              View website
            </Link>
          </div>
        </header>

        <nav
          className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-white p-3 sm:grid-cols-3 lg:hidden dark:border-white/[.08] dark:bg-[#303f55]"
          aria-label="Mobile admin navigation"
        >
          <NavLink end to="/admin" className={navClass}>
            <Icon name="dashboard" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/project-reviews" className={navClass}>
            <Icon name="reviews" />
            Project Reviews
          </NavLink>
          <NavLink to="/admin/settings" className={navClass}>
            <Icon name="settings" />
            Navigation & Dropdowns
          </NavLink>
          <NavLink to="/admin/cms" className={navClass}>
            <Icon name="reviews" />
            Content CMS
          </NavLink>
          <NavLink to="/admin/blogs" className={navClass}>
            <Icon name="reviews" />
            Blog Posts
          </NavLink>
          <NavLink to="/admin/site-content" className={navClass}>
            <Icon name="settings" />
            Home & Footer
          </NavLink>

          <NavLink to="/admin/contact-messages" className={navClass}>
            <Icon name="reviews" />
            Contact Messages
          </NavLink>
        </nav>

        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
