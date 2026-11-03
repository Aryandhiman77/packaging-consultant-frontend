import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

const NotificationContext = createContext(null);
export const useAdminNotifications = () => useContext(NotificationContext);

export function AdminNotificationProvider({ children }) {
  const { request } = useApi();
  const [data, setData] = useState({ unread: { total: 0, contact: 0, review: 0 }, items: [] });
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const refresh = useCallback(async (signal) => {
    try {
      const result = await request("/api/admin/notifications", { cache: "no-store", signal });
      if (!signal?.aborted) { setData(result); setLoaded(true); setError(""); }
    } catch (err) { if (!signal?.aborted) setError(err.message); }
  }, [request]);

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const load = async () => {
      if (pending || document.visibilityState === "hidden") return;
      pending = true;
      await refresh(controller.signal);
      pending = false;
    };
    load();
    const timer = setInterval(load, 15000);
    window.addEventListener("focus", load);
    window.addEventListener("admin-notifications-changed", load);
    const channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel("pc-admin-events");
    if (channel) channel.onmessage = event => { if (event.data?.type === "project-review-created") load(); };
    const storageChanged = event => { if (event.key === "pc-project-review-created") load(); };
    window.addEventListener("storage", storageChanged);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      clearInterval(timer);
      window.removeEventListener("focus", load);
      window.removeEventListener("admin-notifications-changed", load);
      window.removeEventListener("storage", storageChanged);
      channel?.close();
      document.removeEventListener("visibilitychange", load);
    };
  }, [refresh]);

  return <NotificationContext.Provider value={{ ...data, error, loaded, refresh }}>{children}</NotificationContext.Provider>;
}

export function UnreadBadge({ type }) {
  const { unread } = useAdminNotifications();
  return unread[type] > 0 ? <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800" aria-label={`${unread[type]} unread`}>{unread[type]}</span> : null;
}

export default function AdminNotifications() {
  const { unread, items, error, loaded, refresh } = useAdminNotifications();
  const { request } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [actionError, setActionError] = useState("");
  const container = useRef(null);
  const bell = useRef(null);

  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === "Escape") { setOpen(false); bell.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  async function act(item, retry = false) {
    setBusy(`${item.type}-${item._id}`);
    setActionError("");
    try {
      if (retry || !item.adminSeenAt) {
        await request(`/api/admin/notifications/${item.type}/${item._id}/${retry ? "retry-email" : "read"}`, { method: retry ? "POST" : "PATCH" });
        await refresh();
      }
      if (!retry) {
        setOpen(false);
        navigate(item.type === "review" ? `/admin/project-reviews/${item._id}` : `/admin/contact-messages?open=${item._id}`);
      }
    } catch (err) { setActionError(err.message); }
    finally { setBusy(""); }
  }

  return <div ref={container} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <button ref={bell} type="button" className="pc-action relative grid h-10 w-10 place-items-center" aria-label={`Notifications, ${unread.total} unread`} aria-expanded={open} aria-controls="admin-notifications" onClick={() => { setOpen(value => !value); if (!open) refresh(); }}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 21h6" /></svg>
      {unread.total > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">{unread.total > 99 ? "99+" : unread.total}</span>}
    </button>
    <span className="sr-only" role="status" aria-live="polite">{loaded ? `${unread.total} unread notifications` : "Loading notifications"}</span>
    {open && <section id="admin-notifications" aria-label="Notifications" className="pc-card fixed left-3 right-3 top-16 rounded-2xl border shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[420px]">
      <div className="flex items-center justify-between gap-3 border-b p-4"><div><h2 className="font-bold">Notifications</h2><p className="text-xs text-slate-500">{unread.total} unread · Updates every 15 seconds</p></div><button type="button" className="pc-action text-xs" onClick={() => refresh()}>Refresh</button></div>
      {(error || actionError) && <p role="alert" className="pc-error m-3 p-3 text-sm">{actionError || error}</p>}
      <div className="max-h-[55vh] overflow-y-auto">
        {!loaded && !error && <p className="p-5 text-sm">Loading notifications...</p>}
        {loaded && !items.length && <p className="p-5 text-sm text-slate-500">No submissions yet.</p>}
        {items.map(item => <article key={`${item.type}-${item._id}`} className={`border-b p-4 ${!item.adminSeenAt ? "bg-red-50 dark:bg-white/[.04]" : ""}`}>
          <button type="button" disabled={!!busy} onClick={() => act(item)} className="block w-full text-left disabled:opacity-50">
            <span className="flex items-center gap-2 text-sm font-bold">{!item.adminSeenAt && <span className="h-2 w-2 shrink-0 rounded-full bg-red-600" />} {item.type === "review" ? "Project review" : "Contact message"}{!item.adminSeenAt && <span className="sr-only">Unread</span>}</span>
            <span className="mt-1 block break-words text-sm">{item.name || "Visitor"} · {item.type === "review" ? item.referenceNumber : item.topic}</span>
            <time className="mt-1 block text-xs text-slate-500" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>
          </button>
          {(item.notificationStatus !== "sent" || item.clientEmailStatus !== "sent") && <button type="button" disabled={!!busy} className="mt-2 text-xs font-semibold underline" onClick={() => act(item, true)}>{busy === `${item.type}-${item._id}` ? "Please wait..." : "Retry unsent emails"}</button>}
        </article>)}
      </div>
      <div className="flex justify-between gap-3 p-4 text-sm font-semibold"><Link to="/admin/contact-messages" onClick={() => setOpen(false)}>Contact Messages</Link><Link to="/admin/project-reviews" onClick={() => setOpen(false)}>Project Reviews</Link></div>
    </section>}
  </div>;
}
