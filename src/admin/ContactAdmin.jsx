import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useApi } from "../context/ApiContext";
import AdminStatusBadge, { statusLabel } from "./AdminStatusBadge";

const statuses = ["new", "in-progress", "resolved"];

export default function ContactAdmin() {
  const { request } = useApi();
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("open");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const refresh = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "25" });
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    return request(`/api/admin/contact-messages?${params}`, { cache: "no-store" }).then(result => {
      setList(result.data || []);
      setTotal(result.total || 0);
      setPages(result.pages || 0);
    });
  }, [request, page, status, search]);

  useEffect(() => { refresh().catch(err => setError(err.message)); }, [refresh]);
  useEffect(() => {
    if (!selected?._id || selected.adminSeenAt) return;
    let active = true;
    request(`/api/admin/notifications/contact/${selected._id}/read`, { method: "PATCH" }).then(() => {
      window.dispatchEvent(new Event("admin-notifications-changed"));
      if (active) {
        setSelected(old => old?._id === selected._id ? { ...old, adminSeenAt: new Date().toISOString() } : old);
        refresh().catch(() => {});
      }
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [selected?._id, selected?.adminSeenAt, request, refresh]);
  useEffect(() => {
    if (!openId) return;
    let active = true;
    request(`/api/admin/contact-messages/${encodeURIComponent(openId)}`).then(result => { if (active) setSelected(result.data); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [openId, request]);

  async function save() {
    setSaving(true);
    setError("");
    try {
      const result = await request(`/api/admin/contact-messages/${selected._id}`, { method: "PATCH", body: JSON.stringify({ status: selected.status, notes: selected.notes }) });
      setSelected(result.data);
      toast.success("Contact message saved successfully.");
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function resend() {
    setSaving(true);
    setError("");
    try {
      const result = await request(`/api/admin/contact-messages/${selected._id}/resend`, { method: "POST" });
      setNotice(`Admin email: ${result.data.admin?.status || "pending"} · Client email: ${result.data.client?.status || "pending"}`);
      const detail = await request(`/api/admin/contact-messages/${selected._id}`);
      setSelected(detail.data);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  function applyFilters(event) {
    event.preventDefault();
    setPage(1);
    setSearch(searchText.trim());
  }

  return <section className="space-y-5">
    <div><p className="pc-eyebrow">Customer enquiries</p><h1 className="text-2xl font-black">Contact Messages ({total})</h1><p className="text-sm text-slate-500">Filter submissions by status, name, email, company or topic.</p></div>
    <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
      <input type="search" value={searchText} maxLength={100} onChange={event => setSearchText(event.target.value)} placeholder="Search messages" className="pc-field min-w-52 flex-1 rounded-lg border px-3 py-2.5" />
      <select value={status} onChange={event => { setStatus(event.target.value); setPage(1); }} className="pc-field rounded-lg border px-3 py-2.5"><option value="">All statuses</option>{statuses.map(item => <option key={item} value={item}>{statusLabel(item)}</option>)}</select>
      <button type="submit" className="pc-primary px-5 py-2.5">Search</button>
      {(status || search) && <button type="button" className="pc-action" onClick={() => { setStatus(""); setSearch(""); setSearchText(""); setPage(1); }}>Clear</button>}
    </form>
    {error && <p role="alert" className="pc-error p-3">{error}</p>}{notice && <p role="status" className="pc-success p-3">{notice}</p>}
    <div className="overflow-x-auto rounded-xl border bg-white dark:bg-[#101722]"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b"><th className="p-3">Date</th><th className="p-3">Name</th><th className="p-3">Topic</th><th className="p-3">Status</th><th className="p-3">Email delivery</th><th className="p-3">Action</th></tr></thead><tbody>{list.map(item => <tr className="border-b" key={item._id}><td className="p-3">{new Date(item.createdAt).toLocaleString()}</td><td className="p-3"><strong>{item.name}</strong><span className="block text-xs text-slate-500">{item.email}</span></td><td className="p-3">{item.topic}</td><td className="p-3"><AdminStatusBadge status={item.status} /></td><td className="p-3"><AdminStatusBadge status={item.notificationStatus || "pending"} /></td><td className="p-3"><button onClick={() => { setSelected(item); setNotice(""); }} className="font-semibold text-red-600 underline">Details</button></td></tr>)}</tbody></table>{!list.length && <p className="p-4">No contact messages found.</p>}</div>
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-500">{total} record{total === 1 ? "" : "s"}</p><div className="flex items-center gap-3"><button className="pc-action" disabled={page === 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page}{pages ? ` of ${pages}` : ""}</span><button className="pc-action" disabled={!pages || page >= pages} onClick={() => setPage(value => value + 1)}>Next</button></div></div>
    {selected && <div role="dialog" aria-modal="true" aria-label="Contact message details" className="fixed inset-0 z-[200] grid place-items-center bg-black/70 p-3"><div className="max-h-[95vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 text-slate-900"><div className="flex justify-between gap-4"><div><h2 className="text-lg font-black">{selected.name} · {selected.topic}</h2><div className="mt-2"><AdminStatusBadge status={selected.status} /></div></div><button onClick={() => { setSelected(null); if (openId) setSearchParams({}); }} aria-label="Close" className="text-2xl">×</button></div><p><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a> | <strong>Phone:</strong> {selected.telephone || "N/A"}</p><p><strong>Company:</strong> {selected.company || "N/A"} | <strong>City/State:</strong> {selected.cityState || "N/A"}</p><p><strong>Preferred:</strong> {selected.contactMethod}, {selected.bestTime || "No time specified"}</p><p><strong>Requested:</strong> {selected.responses.join(", ") || "Not specified"}</p><pre className="whitespace-pre-wrap rounded bg-slate-100 p-4 font-sans">{selected.message}</pre><div className="flex flex-wrap gap-3"><span><strong>Admin email:</strong> <AdminStatusBadge status={selected.notificationStatus || "pending"} /></span><span><strong>Client confirmation:</strong> <AdminStatusBadge status={selected.clientEmailStatus || "pending"} /></span></div><label className="block font-semibold">Status<select className="mt-1 w-full rounded border p-2" value={selected.status} onChange={event => setSelected({ ...selected, status: event.target.value })}>{statuses.map(item => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></label><label className="block font-semibold">Internal notes<textarea className="mt-1 min-h-28 w-full rounded border p-2" value={selected.notes} onChange={event => setSelected({ ...selected, notes: event.target.value })} /></label><div className="flex flex-wrap justify-end gap-2"><button className="rounded border px-4 py-2" disabled={saving} onClick={resend}>Retry unsent emails</button><button className="rounded bg-red-600 px-5 py-2 text-white" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Details"}</button></div></div></div>}
  </section>;
}
