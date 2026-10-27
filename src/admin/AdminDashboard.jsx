import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";

function MetricIcon({ type }) {
  const paths = {
    reviews: (
      <>
        <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5a1.5 1.5 0 0 1 1-1.5Z" />
        <path d="M14 3.5V8h4.5M9 12h6M9 15.5h6M9 19h4" />
      </>
    ),
    navigation: <path d="M4 6h16M4 12h16M4 18h10" />,
    dropdown: <path d="M5 6h14M7 11h10M9 16h6M10 20l2 2 2-2" />,
  };

  return (
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths[type]}
      </svg>
    </span>
  );
}

export default function AdminDashboard() {
  const { getAdminSettings, listProjectReviews } = useApi();

  const [data, setData] = useState({
    reviews: "-",
    navigation: "-",
    dropdownLinks: "-",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [settings, reviews] = await Promise.all([
          getAdminSettings(),
          listProjectReviews({
            page: 1,
            limit: 1,
          }),
        ]);

        if (!active) return;

        const menu = settings.data.topNavigation || [];

        setData({
          reviews: reviews.pagination.total,
          navigation: menu.length,
          dropdownLinks: menu.reduce(
            (count, item) => count + (item.children?.length || 0),
            0,
          ),
        });
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [getAdminSettings, listProjectReviews]);

  const cards = [
    {
      title: "Project Reviews",
      value: data.reviews,
      icon: "reviews",
    },
    {
      title: "Navigation Links",
      value: data.navigation,
      icon: "navigation",
    },
    {
      title: "Dropdown Links",
      value: data.dropdownLinks,
      icon: "dropdown",
    },
  ];

  return (
    <main>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <p className="mt-2 text-sm text-slate-500">Packaging Consultants USA</p>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-6 text-slate-900 transition-colors dark:border-white/[.09] dark:bg-[#111a27] dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-500">{card.title}</h2>
                <p className="mt-3 text-3xl font-bold">{card.value}</p>
              </div>
              <MetricIcon type={card.icon} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/admin/project-reviews"
          className="rounded-lg bg-red-600 px-5 py-3 font-bold !text-white no-underline"
        >
          View Project Reviews
        </Link>

        <Link
          to="/admin/settings"
          className="rounded-lg border border-slate-300 px-5 py-3 font-bold !text-slate-700 dark:border-white/[.12] dark:!text-slate-200"
        >
          Manage Navigation
        </Link>
      </div>
    </main>
  );
}
