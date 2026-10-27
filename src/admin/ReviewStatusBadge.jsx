const statusStyles = {
  new: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300",
  in_review: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300",
  waiting_for_client: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300",
  closed: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-400/20 dark:bg-slate-400/10 dark:text-slate-300",
};

const dotStyles = {
  new: "bg-sky-500",
  in_review: "bg-violet-500",
  waiting_for_client: "bg-amber-500",
  completed: "bg-emerald-500",
  closed: "bg-slate-500",
};

export function statusLabel(status = "") {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ReviewStatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.closed;
  const dot = dotStyles[status] || dotStyles.closed;

  return (
    <span className={`inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-black tracking-wide ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}
