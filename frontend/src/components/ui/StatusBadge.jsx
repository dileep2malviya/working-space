const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Available: "bg-emerald-50 text-emerald-700",
    Approved: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Scheduled: "bg-violet-50 text-violet-700",
    Inactive: "bg-slate-100 text-slate-600",
    Declined: "bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        styles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;