import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  X,
} from "lucide-react";

import BookingStatusBadge from "./BookingStatusBadge";

const BookingCard = ({
  booking,
  onCancel,
  onEdit,
  onView,
}) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-950">
              {booking.space}
            </h3>

            <BookingStatusBadge status={booking.status} />
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={15} />
              {booking.date}
            </span>

            <span className="flex items-center gap-2">
              <Clock3 size={15} />
              {booking.start} - {booking.end}
            </span>
          </p>

        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onView(booking)}
            className="cursor-pointer text-sm font-bold text-black-600 hover:text-black-800"
          >
            View details
          </button>

          {booking.status === "Pending" && (
            <button
              type="button"
              onClick={() => onEdit(booking)}
              aria-label={`Edit booking for ${booking.space}`}
              className="flex items-center gap-1 cursor-pointer text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              <Pencil size={16} />
              Edit
            </button>
          )}

          {["Pending", "Approved"].includes(booking.status) && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="flex items-center cursor-pointer gap-1 text-sm font-bold text-rose-600 hover:text-rose-800"
            >
              <X size={15} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookingCard;