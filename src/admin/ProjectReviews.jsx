import { useCallback, useEffect, useState } from "react";

import { useApi } from "../context/ApiContext";
import ProjectReviewModal from "./ProjectReviewModal";
import ReviewStatusBadge, { statusLabel } from "./ReviewStatusBadge";

const statuses = [
  "new",
  "in_review",
  "waiting_for_client",
  "completed",
  "closed",
];

export default function ProjectReviews() {
  const { listProjectReviews } = useApi();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState("");

  const [result, setResult] = useState({
    data: [],
    pagination: {
      page: 1,
      pages: 0,
      total: 0,
    },
  });

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      setLoading(true);
      setError("");

      try {
        const response = await listProjectReviews(filters);

        if (active) {
          setResult(response);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReviews();

    return () => {
      active = false;
    };
  }, [filters, refresh, listProjectReviews]);

  const { data, pagination } = result;

  const pageNumbers = [...new Set([
    1,
    pagination.page - 1,
    pagination.page,
    pagination.page + 1,
    pagination.pages,
  ])]
    .filter((page) => page >= 1 && page <= pagination.pages)
    .sort((a, b) => a - b);

  const closeReviewModal = useCallback(() => {
    setSelectedReviewId("");
  }, []);

  const updateVisibleReview = useCallback((updated) => {
    setResult((current) => ({
      ...current,
      data: current.data.map((item) =>
        item._id === updated._id
          ? { ...item, status: updated.status, updatedAt: updated.updatedAt }
          : item,
      ),
    }));
  }, []);

  const changeStatus = (status) => {
    setFilters((current) => ({
      ...current,
      page: 1,
      status,
    }));
  };

  const searchReviews = (event) => {
    event.preventDefault();

    setFilters((current) => ({
      ...current,
      page: 1,
      search: searchText.trim(),
    }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Reviews</h1>

          <p className="mt-2 text-sm text-slate-500">
            View and manage customer submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefresh((v) => v + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 dark:border-white/[.12] dark:text-slate-200"
        >
          Refresh
        </button>
      </div>

      <form onSubmit={searchReviews} className="mt-6 flex flex-wrap gap-3">
        <input
          value={searchText}
          maxLength={100}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search name, email, reference"
          className="min-w-48 flex-1 rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-white/[.12] dark:bg-[#111a27] dark:text-slate-100"
        />

        <select
          value={filters.status}
          onChange={(e) => changeStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-white/[.12] dark:bg-[#111a27] dark:text-slate-100"
        >
          <option value="">All statuses</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white"
        >
          Search
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-white/[.09] dark:bg-[#111a27]">
        <table className="w-full min-w-[750px] text-left text-sm text-slate-800 dark:text-slate-200">
          <thead className="bg-slate-100 dark:bg-white/[.05]">
            <tr>
              <th className="p-4">Reference</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Company</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody className={`transition-opacity duration-200 ${loading ? "opacity-45" : "opacity-100"}`}>
            {data.map((review) => (
              <tr key={review._id} className="border-t border-slate-200 transition-colors duration-200 hover:bg-slate-50 dark:border-white/[.08] dark:hover:bg-white/[.025]">
                <td className="p-4 font-mono text-xs">
                  {review.referenceNumber}
                </td>

                <td className="p-4">
                  <strong className="block">{review.name}</strong>
                  <span className="text-xs">{review.email}</span>
                </td>

                <td className="p-4">{review.company || "-"}</td>

                <td className="p-4">
                  {new Date(review.createdAt).toLocaleString()}
                </td>

                <td className="p-4">
                  <ReviewStatusBadge status={review.status} />
                </td>

                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => setSelectedReviewId(review._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-xs font-black text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md active:translate-y-0"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && !error && data.length === 0 && (
          <p className="p-6 text-center text-slate-500">
            No Project Reviews found.
          </p>
        )}

        {loading && <p className="p-6 text-slate-500">Loading...</p>}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {pagination.total > 0
            ? `Showing ${(pagination.page - 1) * (pagination.limit || 10) + 1}-${Math.min(
                pagination.page * (pagination.limit || 10),
                pagination.total,
              )} of ${pagination.total}`
            : "0 records"}
        </p>

        <nav className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1" aria-label="Project Review pagination">
          <button
            type="button"
            disabled={loading || filters.page <= 1}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page - 1,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold transition duration-200 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.12]"
          >
            Previous
          </button>

          {pageNumbers.map((page, index) => {
            const previousPage = pageNumbers[index - 1];
            return (
              <span key={page} className="contents">
                {previousPage && page - previousPage > 1 && (
                  <span className="px-1 text-slate-400">…</span>
                )}
                <button
                  type="button"
                  aria-current={page === pagination.page ? "page" : undefined}
                  disabled={loading}
                  onClick={() => setFilters((current) => ({ ...current, page }))}
                  className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-xs font-black transition duration-200 ${
                    page === pagination.page
                      ? "scale-105 bg-red-600 text-white shadow-md"
                      : "border border-slate-300 hover:-translate-y-0.5 hover:border-red-500 hover:text-red-600 dark:border-white/[.12]"
                  }`}
                >
                  {page}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            disabled={loading || filters.page >= pagination.pages}
            onClick={() =>
              setFilters((current) => ({
                ...current,
                page: current.page + 1,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold transition duration-200 hover:border-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.12]"
          >
            Next
          </button>
        </nav>
      </div>

      {selectedReviewId && (
        <ProjectReviewModal
          id={selectedReviewId}
          onClose={closeReviewModal}
          onUpdated={updateVisibleReview}
        />
      )}
    </div>
  );
}
