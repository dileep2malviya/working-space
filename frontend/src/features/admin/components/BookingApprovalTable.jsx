import { Check, MoreHorizontal, X } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";
import { convertDate } from "@/utils/helpers";

const BookingApprovalTable = ({ bookings, onUpdate, isUpdating = false }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold">Requester</th>
              <th className="px-6 py-4 font-bold">Space</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 text-right font-bold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">
                    {booking.user.lastName} {booking.user.firstName}
                  </p>

                  <p className="text-xs text-slate-500">
                    {booking.user.email}
                  </p>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  Name: {booking.space.name}
                  
                  
                  <p>Space Type: {booking.space.type}</p>
                  <p>Capacity : {booking.space.capacity}</p>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {convertDate(booking.bookingDate)}

                  <p>{booking.startTime} - {booking.endTime}</p>

                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={booking.status} />
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {booking.status === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            onUpdate(booking._id, "APPROVED")
                          }
                          className="rounded-lg bg-emerald-50 p-2 text-emerald-700 hover:bg-emerald-100"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            onUpdate(booking._id, "REJECTED")
                          }
                          className="rounded-lg bg-rose-50 p-2 text-rose-700 hover:bg-rose-100"
                          title="Decline"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingApprovalTable;