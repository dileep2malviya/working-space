const AdminStatCard = ({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue",
}) => {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {detail}
      </p>
    </article>
  );
};

export default AdminStatCard;