import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminNotifications } from "./AdminNotifications";
import { useApi } from "../context/ApiContext";

const cardStyle = "rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-white/10 dark:bg-[#344258] dark:text-slate-100";

export default function AdminDashboard() {
  const { request, getAdminSettings, listProjectReviews } = useApi();
  const notifications = useAdminNotifications();
  const [stats, setStats] = useState({ reviews: "-", navigation: "-", dropdown: "-" });
  const [newContacts, setNewContacts] = useState([]);
  const [newContactTotal, setNewContactTotal] = useState("-");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      getAdminSettings(),
      listProjectReviews({ page: 1, limit: 1 }),
      request("/api/admin/contact-messages?status=new&page=1&limit=6", { cache: "no-store" }),
    ]).then(([settings, reviews, contacts]) => {
      if (!active) return;
      const menu = settings.data?.topNavigation || [];
      setStats({ reviews: reviews.pagination?.total ?? 0, navigation: menu.length, dropdown: menu.reduce((total, item) => total + (item.children?.length || 0), 0) });
      setNewContacts(contacts.data || []);
      setNewContactTotal(contacts.total ?? 0);
      setError("");
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [getAdminSettings, listProjectReviews, request, notifications.unread.contact, notifications.unread.review]);

  return <main className="space-y-7">
    <div><h1 className="text-3xl font-black">Admin Dashboard</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Packaging Consultants USA</p></div>
    {error && <p role="alert" className="pc-error p-3">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[["New contact messages", newContactTotal, "Status: new"], ["Project Reviews", stats.reviews, `${notifications.unread.review} unread`], ["Navigation Links", stats.navigation, "Live menu items"], ["Dropdown Links", stats.dropdown, "Menu subpages"]].map(([label, value, subtitle]) => <div className={cardStyle} key={label}><p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{subtitle}</p></div>)}
    </div>

    <section className={cardStyle} aria-labelledby="new-contact-heading">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="pc-eyebrow">Needs attention</p><h2 id="new-contact-heading" className="text-xl font-black">New contact messages</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Only messages whose workflow status is <strong>new</strong> appear here.</p></div><Link to="/admin/contact-messages" className="pc-action no-underline">View all messages</Link></div>
      <div className="mt-5 divide-y divide-slate-200 dark:divide-slate-600">
        {newContacts.map(item => <article key={item._id} className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"><div className="min-w-0"><p className="font-bold">{item.name || "Visitor"}</p><p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{item.topic}</p><time className="mt-1 block text-xs text-slate-500" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div><Link to={`/admin/contact-messages?open=${item._id}`} className="pc-primary shrink-0 px-4 py-2 text-center no-underline">View details</Link></article>)}
        {newContactTotal === 0 && <p className="py-6 text-sm text-slate-500">No new contact messages.</p>}
      </div>
    </section>
  </main>;
}
