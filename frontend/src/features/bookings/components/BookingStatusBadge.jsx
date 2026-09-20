const BookingStatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
    Cancelled: "bg-slate-100 text-slate-600",
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

export default BookingStatusBadge;