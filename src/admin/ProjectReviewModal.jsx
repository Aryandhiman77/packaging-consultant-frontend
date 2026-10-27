import { useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "../context/ApiContext";
import { projectReviewSteps } from "../data/projectReview";
import ReviewStatusBadge, { statusLabel } from "./ReviewStatusBadge";
import { readProductFormAnswers } from "../utils/projectReviewValidation";

const statuses = [
  "new",
  "in_review",
  "waiting_for_client",
  "completed",
  "closed",
];

function getRows(step, group, answers) {
  if (group.type === "radio") {
    return answers[group.name] ? [[group.heading, answers[group.name]]] : [];
  }

  if (group.type === "checkbox") {
    return group.options
      .filter(
        (option) => answers[`${step.slug}:${group.name}:${option}`] === true,
      )
      .map((option) => [option, "Yes"]);
  }

  if (group.type === "file") return [];

  const rows = (group.fields || [])
    .map((label) => [label, answers[`${step.slug}:${group.heading}:${label}`]])
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    );

  if (group.embeddedRadio && answers[group.embeddedRadio.name]) {
    const field = group.embeddedRadio;
    const productForm = readProductFormAnswers(answers);
    const afterIndex = rows.findIndex(([label]) => label === field.afterField);
    const embeddedRows = [[field.label, productForm.productForm]];

    if (
      productForm.productForm === field.otherField?.trigger &&
      productForm.productFormOther
    ) {
      embeddedRows.push([field.otherField.label, productForm.productFormOther]);
    }

    rows.splice(
      afterIndex >= 0 ? afterIndex + 1 : rows.length,
      0,
      ...embeddedRows,
    );
  }

  return rows;
}

export default function ProjectReviewModal({ id, onClose, onUpdated }) {
  const { getProjectReview, updateProjectReview, downloadProjectReviewFile } =
    useApi();
  const closeButtonRef = useRef(null);
  const closeTimerRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState(null);
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState("");
  const [opening, setOpening] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const requestClose = useCallback(() => {
    if (closeTimerRef.current) return;
    setVisible(false);
    closeTimerRef.current = window.setTimeout(onClose, 220);
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      setVisible(true);
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, [requestClose]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await getProjectReview(id);
        if (!active) return;

        setReview(result.data);
        setStatus(result.data.status);
        setAdminNotes(result.data.adminNotes || "");
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id, getProjectReview]);

  const saveChanges = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await updateProjectReview(id, { status, adminNotes });
      setReview(result.data);
      onUpdated(result.data);
      setMessage("Review updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const downloadFile = async (file) => {
    setDownloading(file.fileId);
    setError("");

    try {
      const blob = await downloadProjectReviewFile(id, file.fileId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.originalName || "attachment";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading("");
    }
  };

  const openFile = async (file) => {
    const newTab = window.open("about:blank", "_blank");
    if (!newTab) {
      setError("Allow pop-ups to open this attachment in a new tab.");
      return;
    }

    newTab.opener = null;
    setOpening(file.fileId);
    setError("");

    try {
      const blob = await downloadProjectReviewFile(id, file.fileId);
      const url = URL.createObjectURL(blob);
      newTab.location.href = url;
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      newTab.close();
      setError(err.message);
    } finally {
      setOpening("");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/70 p-0 backdrop-blur-sm transition-opacity duration-200 sm:p-5 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-review-modal-title"
        className={`flex h-full w-full max-w-7xl flex-col overflow-hidden bg-slate-50 text-slate-900 shadow-2xl transition duration-300 ease-out dark:bg-[#0b1018] dark:text-slate-100 sm:h-[calc(100vh-2.5rem)] sm:rounded-2xl ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-[.985] opacity-0"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 dark:border-white/[.09] dark:bg-[#111a27] sm:px-7">
          <div className="min-w-0">
            <p className="text-xs font-black tracking-[.16em] text-red-600 uppercase">
              Project Review
            </p>
            <h2
              id="project-review-modal-title"
              className="mt-1 truncate text-xl font-black sm:text-2xl"
            >
              {review?.referenceNumber || "Review details"}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            aria-label="Close review details"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-700 transition duration-200 hover:rotate-90 hover:bg-red-50 hover:text-red-600 dark:bg-white/[.08] dark:text-slate-200 dark:hover:bg-red-500/15"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-7">
          {loading && (
            <div className="grid min-h-[360px] place-items-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-red-600" />
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Loading Project Review...
                </p>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {!loading && review && (
            <div>
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-black">{review.name}</h3>
                  <ReviewStatusBadge status={review.status} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Submitted {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
                <div className="space-y-5">
                  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/[.09] dark:bg-[#111a27]">
                    <h3 className="text-lg font-bold">Contact Information</h3>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <p className="break-all">
                        <strong>Email:</strong> {review.email}
                      </p>
                      <p>
                        <strong>Company:</strong> {review.company || "-"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {review.phone || "-"}
                      </p>
                    </div>
                  </section>

                  {projectReviewSteps.map((step) => {
                    const populatedGroups = step.groups
                      .map((group) => ({
                        group,
                        rows: getRows(step, group, review.answers || {}),
                      }))
                      .filter(({ rows }) => rows.length);

                    if (!populatedGroups.length) return null;

                    return (
                      <section
                        key={step.slug}
                        className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/[.09] dark:bg-[#111a27]"
                      >
                        <h3 className="text-lg font-bold">{step.title}</h3>
                        {populatedGroups.map(({ group, rows }) => (
                          <div
                            key={group.heading}
                            className="mt-4 border-t border-slate-200 pt-4 dark:border-white/[.09]"
                          >
                            <h4 className="font-bold">{group.heading}</h4>
                            <dl className="mt-3 space-y-3">
                              {rows.map(([label, value]) => (
                                <div
                                  key={label}
                                  className="grid gap-1 sm:grid-cols-2"
                                >
                                  <dt className="text-sm text-slate-500">
                                    {label}
                                  </dt>
                                  <dd className="break-words text-sm">
                                    {String(value)}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ))}
                      </section>
                    );
                  })}

                  <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/[.09] dark:bg-[#111a27]">
                    <h3 className="text-lg font-bold">Attachments</h3>
                    {!review.attachments?.length && (
                      <p className="mt-3 text-sm text-slate-500">
                        No files attached.
                      </p>
                    )}
                    <ul className="mt-4 space-y-3">
                      {(review.attachments || []).map((file) => (
                        <li
                          key={file.fileId}
                          className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-white/[.09]"
                        >
                          <button
                            type="button"
                            disabled={Boolean(opening)}
                            onClick={() => openFile(file)}
                            className="break-all text-left text-sm text-red-700 underline decoration-transparent underline-offset-4 transition hover:decoration-current disabled:opacity-50 dark:text-red-300"
                          >
                            {opening === file.fileId
                              ? "Opening..."
                              : file.originalName}
                          </button>
                          <button
                            type="button"
                            disabled={Boolean(downloading)}
                            onClick={() => downloadFile(file)}
                            className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold transition hover:border-red-500 hover:text-red-600 disabled:opacity-40 dark:border-white/[.15]"
                          >
                            {downloading === file.fileId
                              ? "Downloading..."
                              : "Download"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <aside className="self-start rounded-xl border border-slate-200 bg-white p-5 dark:border-white/[.09] dark:bg-[#111a27] xl:sticky xl:top-0">
                  <h3 className="text-lg font-bold">Manage Review</h3>
                  <form onSubmit={saveChanges} className="mt-5 space-y-5">
                    <label className="block">
                      <span className="block text-sm font-bold">
                        Review Status
                      </span>
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-white/[.12] dark:bg-[#0b1018]"
                      >
                        {statuses.map((item) => (
                          <option key={item} value={item}>
                            {statusLabel(item)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="block text-sm font-bold">
                        Admin Notes
                      </span>
                      <textarea
                        rows={7}
                        maxLength={5000}
                        value={adminNotes}
                        onChange={(event) => setAdminNotes(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-white/[.12] dark:bg-[#0b1018]"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    {message && (
                      <p
                        role="status"
                        className="text-sm font-semibold text-green-700 dark:text-green-400"
                      >
                        {message}
                      </p>
                    )}
                  </form>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
