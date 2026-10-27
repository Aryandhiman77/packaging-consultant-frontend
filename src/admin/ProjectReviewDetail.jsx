import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useApi } from "../context/ApiContext";

import { projectReviewSteps } from "../data/projectReview";
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

  if (group.type === "file") {
    return [];
  }

  const rows = (group.fields || [])
    .map((label) => [label, answers[`${step.slug}:${group.heading}:${label}`]])
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    );

  const productForm = readProductFormAnswers(answers);
  if (group.embeddedRadio && productForm.productForm) {
    const field = group.embeddedRadio;
    const afterIndex = rows.findIndex(([label]) => label === field.afterField);
    const embeddedRows = [[field.label, productForm.productForm]];

    if (
      productForm.productForm === field.otherField?.trigger &&
      productForm.productFormOther
    ) {
      embeddedRows.push([field.otherField.label, productForm.productFormOther]);
    }

    rows.splice(afterIndex >= 0 ? afterIndex + 1 : rows.length, 0, ...embeddedRows);
  }

  return rows;
}

export default function ProjectReviewDetail() {
  const { id } = useParams();

  const { getProjectReview, updateProjectReview, downloadProjectReviewFile } =
    useApi();

  const [review, setReview] = useState(null);
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

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
      const result = await updateProjectReview(id, {
        status,
        adminNotes,
      });

      setReview(result.data);

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

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 10000);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading("");
    }
  };

  if (loading) {
    return <p>Loading Project Review...</p>;
  }

  return (
    <div>
      <Link to="/admin/project-reviews" className="font-bold text-red-600">
        ← Back to Project Reviews
      </Link>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {review && (
        <>
          <header className="mt-6">
            <p className="text-sm font-bold text-red-600">
              {review.referenceNumber}
            </p>

            <h1 className="mt-2 text-3xl font-bold">{review.name}</h1>

            <p className="mt-2 text-sm text-slate-500">
              Submitted: {new Date(review.createdAt).toLocaleString()}
            </p>
          </header>

          <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              {/* CONTACT */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-white/[.09] dark:bg-[#111a27] dark:text-slate-100">
                <h2 className="text-xl font-bold">Contact Information</h2>

                <div className="mt-4 space-y-2 text-sm">
                  <p>
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

              {/* ALL SEVEN STEPS */}
              {projectReviewSteps.map((step) => (
                <section
                  key={step.slug}
                  className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-white/[.09] dark:bg-[#111a27] dark:text-slate-100"
                >
                  <h2 className="text-xl font-bold">{step.title}</h2>

                  {step.groups.map((group) => {
                    const rows = getRows(step, group, review.answers || {});

                    if (!rows.length) return null;

                    return (
                      <div key={group.heading} className="mt-5 border-t pt-4">
                        <h3 className="font-bold">{group.heading}</h3>

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
                    );
                  })}
                </section>
              ))}

              {/* PRIVATE FILES */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-white/[.09] dark:bg-[#111a27] dark:text-slate-100">
                <h2 className="text-xl font-bold">Attachments</h2>

                {!review.attachments?.length && (
                  <p className="mt-3 text-sm text-slate-500">
                    No files attached.
                  </p>
                )}

                <ul className="mt-4 space-y-3">
                  {(review.attachments || []).map((file) => (
                    <li
                      key={file.fileId}
                      className="flex items-center justify-between gap-3 border-b pb-3"
                    >
                      <span className="break-all text-sm">
                        {file.originalName}
                      </span>

                      <button
                        type="button"
                        disabled={Boolean(downloading)}
                        onClick={() => downloadFile(file)}
                        className="rounded-lg border px-3 py-2 text-sm font-bold disabled:opacity-40"
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

            {/* ADMIN ACTIONS */}
            <aside className="self-start rounded-xl border border-slate-200 bg-white p-5 text-slate-900 dark:border-white/[.09] dark:bg-[#111a27] dark:text-slate-100 xl:sticky xl:top-24">
              <h2 className="text-xl font-bold">Manage Review</h2>

              <form onSubmit={saveChanges} className="mt-5 space-y-5">
                <label className="block">
                  <span className="block text-sm font-bold">Review Status</span>

                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-white/[.12] dark:bg-[#0b1018] dark:text-slate-100"
                  >
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="block text-sm font-bold">Admin Notes</span>

                  <textarea
                    rows={7}
                    maxLength={5000}
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-white/[.12] dark:bg-[#0b1018] dark:text-slate-100"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                {message && (
                  <p role="status" className="text-sm text-green-700">
                    {message}
                  </p>
                )}
              </form>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
