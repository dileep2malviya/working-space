import {
  CalendarCheck,
  Clock3,
  ListFilter,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import AdminLayout from "../components/AdminLayout";
import AdminStatCard from "../components/AdminStatCard";
import BookingApprovalTable from "../components/BookingApprovalTable";
import CustomSelect from "@/components/ui/input/CustomSelect";
import { getAllBookingStateSelector } from "@/features/api/booking/bookingAdminSelectors";
import { useGetAllWorkBookingAdmin } from "../hook/booking/useBookingAdmin";
import Loader from "@/components/ui/Loader";

const selectOption = [
  { value: "All", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
]

const ManageBookings = () => {
  const [date, setDate] = useState("");
  const { control, watch, reset } = useForm({
    defaultValues: {
      status: "All",
      space: "All",
    },
  });
  const filters = watch();
  const bookingState = useSelector(getAllBookingStateSelector);
  const { getAllBookingByAdmin, updateBooking, isLoading, isUpdating } =
    useGetAllWorkBookingAdmin();

  const bookings = Array.isArray(bookingState)
    ? bookingState
    : Array.isArray(bookingState?.data)
      ? bookingState.data
      : [];



  useEffect(() => {
    getAllBookingByAdmin();
  }, []);

  const spaces = [...new Set(
    bookings
      .map((booking) => booking.space?.name)
      .filter(Boolean)
  )].sort();

  const visibleBookings = bookings.filter((booking) => {
    const matchesStatus =
      filters.status === "All" || booking.status === filters.status;
    const matchesDate =
      !date || String(booking.bookingDate).slice(0, 10) === date;
    const matchesSpace =
      filters.space === "All" || booking.space?.name === filters.space;

    return matchesStatus && matchesDate && matchesSpace;
  });

  const hasActiveFilters =
    filters.status !== "All" || date || filters.space !== "All";


  return (
    <AdminLayout>
      <div className="space-y-8">

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-slate-950">
                Booking requests
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Approve or decline incoming requests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ListFilter
                size={17}
                className="text-slate-400"
              />

              <CustomSelect
                name="status"
                control={control}
                aria-label="Filter by status"
                options={selectOption}
                placeholder="Status"
              />

              <input
                aria-label="Filter by date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className=" rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200
      focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <CustomSelect
                name="space"
                control={control}
                aria-label="Filter by space"
                options={[
                  { value: "All", label: "All spaces" },
                  ...spaces.map((space) => ({ value: space, label: space })),
                ]}
                placeholder="Space"
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    reset({ status: "All", space: "All" });
                    setDate("");
                  }}
                  className="px-2 py-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <BookingApprovalTable
            bookings={visibleBookings}
            onUpdate={updateBooking}
            isUpdating={isUpdating}
          />
          {isLoading && (
            <Loader loadingName="Loading bookings..." />
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default ManageBookings;