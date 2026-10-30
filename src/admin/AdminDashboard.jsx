import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

const cardStyle = "rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#344258] dark:text-slate-100";

export default function AdminDashboard() {
  const { request, getAdminSettings, listProjectReviews } = useApi();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ reviews: "-", navigation: "-", dropdown: "-" });
  const [notifications, setNotifications] = useState({ unread: { total: 0, contact: 0, review: 0 }, items: [] });
  const [error, setError] = useState("");
  const [opening, setOpening] = useState("");

  const refreshNotifications = useCallback(async () => {
    const result = await request("/api/admin/notifications", { cache: "no-store" });
    setNotifications(result);
  }, [request]);

  useEffect(() => {
    let active = true;
    Promise.all([getAdminSettings(), listProjectReviews({ page: 1, limit: 1 })])
      .then(([settings, reviews]) => {
        if (!active) return;
        const menu = settings.data?.topNavigation || [];
        setStats({
          reviews: reviews.pagination?.total ?? 0,
          navigation: menu.length,
          dropdown: menu.reduce((total, item) => total + (item.children?.length || 0), 0),
        });
      }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [getAdminSettings, listProjectReviews]);

  useEffect(() => {
    let active = true;
    const load = () => refreshNotifications().catch(err => { if (active) setError(err.message); });
    load();
    const interval = setInterval(() => { if (document.visibilityState === "visible") load(); }, 30000);
    return () => { active = false; clearInterval(interval); };
  }, [refreshNotifications]);

  async function openNotification(item) {
    setOpening(item._id);
    setError("");
    try {
      if (!item.adminSeenAt) {
        await request(`/api/admin/notifications/${item.type}/${item._id}/read`, { method: "PATCH" });
      }
      navigate(item.type === "review"
        ? `/admin/project-reviews/${item._id}`
        : `/admin/contact-messages?open=${item._id}`);
    } catch (err) {
      setError(err.message);
    } finally { setOpening(""); }
  }

  async function retryEmail(item) {
    setOpening(item._id);
    setError("");
    try {
      await request(`/api/admin/notifications/${item.type}/${item._id}/retry-email`, { method: "POST" });
      await refreshNotifications();
    } catch (err) { setError(err.message); }
    finally { setOpening(""); }
  }

  return (
    <main className="space-y-7">
      <div>
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Packaging Consultants USA</p>
      </div>
      {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-800">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["New notifications", notifications.unread.total, "Contact + Project Review"],
          ["Project Reviews", stats.reviews, `${notifications.unread.review} unread`],
          ["Navigation Links", stats.navigation, "Live menu items"],
          ["Dropdown Links", stats.dropdown, "Menu subpages"],
        ].map(([label, value, subtitle]) => (
          <div className={cardStyle} key={label}>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
            <p className="mt-3 text-3xl font-black">{value}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{subtitle}</p>
          </div>
        ))}
      </div>
      <section className={cardStyle} aria-label="Latest submissions">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">New enquiries & project reviews</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Unread: {notifications.unread.contact} contact messages, {notifications.unread.review} project reviews.
              Refreshes every 30 seconds when this tab is open.
            </p>
          </div>
          <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold dark:border-slate-500" onClick={() => refreshNotifications().catch(e=>setError(e.message))}>Refresh</button>
        </div>
        <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-600">
          {notifications.items.map(item => (
            <article key={`${item.type}-${item._id}`} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
                  {!item.adminSeenAt && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">NEW</span>}
                  <span>{item.type === "review" ? "Project Review" : "Contact Us"}</span>
                  <span className="font-normal text-slate-500 dark:text-slate-300">{item.name || "Visitor"}</span>
                </p>
                <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
                  {item.type === "review" ? item.referenceNumber : item.topic}
                  {" · "}{new Date(item.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                  Admin email: {item.notificationStatus || "pending"} · Client email: {item.clientEmailStatus || "pending"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {(item.notificationStatus !== "sent" || item.clientEmailStatus !== "sent") && (
                  <button type="button" disabled={opening === item._id} onClick={() => retryEmail(item)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold dark:border-slate-500">Retry email</button>
                )}
                <button type="button" disabled={opening === item._id} onClick={() => openNotification(item)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">{opening === item._id ? "Opening..." : "View details"}</button>
              </div>
            </article>
          ))}
          {notifications.items.length === 0 && <p className="py-6 text-sm text-slate-500">No submissions yet.</p>}
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <Link to="/admin/project-reviews" className="rounded-lg bg-red-600 px-4 py-3 font-bold !text-white no-underline">Project Reviews</Link>
        <Link to="/admin/contact-messages" className="rounded-lg border border-slate-300 px-4 py-3 font-bold !text-slate-700 no-underline dark:border-slate-500 dark:!text-slate-200">Contact Messages</Link>
      </div>
    </main>
  );
}
