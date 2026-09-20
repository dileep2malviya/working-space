import { CalendarCheck, Clock3, Plus, ReceiptText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/features/admin/components/AdminLayout";
import CustomButton from "@/components/ui/button";
import BookingForm from "../components/BookingForm";
import BookingTable from "../components/BookingTable";
import CustomModal from "@/components/ui/Modal";
import { useMemberBooking } from "@/features/bookings/hook/useMemberBooking";
import { useSelector } from "react-redux";
import { getMemberBookingsSelector } from "@/features/api/memberbooking/bookingMemberSelectors";
import BookingDetails from "./BookingDetails";
import Loader from "@/components/ui/Loader";

const filters = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

const formatStatus = (status = "Pending") =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const toBookingView = (booking) => ({
  ...booking,
  spaceId: booking.spaceId || booking.space?._id || booking.space?.id || "",
  spaceDetails: booking.space,
  space: booking.space?.name || booking.spaceName || "Unknown space",
  location: booking.space?.location || booking.location || "Location unavailable",
  date: new Date(booking.bookingDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  start: booking.startTime || booking.start || "-",
  end: booking.endTime || booking.end || "-",
  status: formatStatus(booking.status),
});

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const {
    getMemberBooking,
    createNewBooking,
    updateBooking,
    cancelBooking: cancelBookingRequest,
    isBookingLoading,
  } = useMemberBooking();

  const memberBookingListData = useSelector(getMemberBookingsSelector);

  useEffect(() => {
    getMemberBooking();
  }, []);

  useEffect(() => {
    setBookings(
      (Array.isArray(memberBookingListData) ? memberBookingListData : []).map(
        toBookingView
      )
    );
  }, [memberBookingListData]);



  const visibleBookings = useMemo(
    () =>
      filter === "All"
        ? bookings
        : bookings.filter((booking) => booking.status === filter),
    [bookings, filter]
  );

  const requestCancelBooking = (booking) => setBookingToCancel(booking);

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    const cancelled = await cancelBookingRequest(bookingToCancel._id);
    if (cancelled) setBookingToCancel(null);
  };

  const addBooking = async (booking) => {
   const result = await createNewBooking({
      space: booking.space,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });

    return result
  };

  const editBooking = (booking) => {
    setEditingBooking({
      _id: booking._id,
      space: booking.spaceId,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    setIsFormOpen(true);
  };

  const saveBooking = async (booking) => {
    console.log(booking);
    const result = await updateBooking(booking._id, {
      space: booking.space,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
    return result
  };

  const closeBookingForm = () => {
    setIsFormOpen(false);
    setEditingBooking(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Member workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              My bookings
            </h1>
            <p className="mt-2 text-slate-500">
              See every request, appointment detail, and booking status in one
              place.
            </p>
          </div>
          <CustomButton
            onclick={() => setIsFormOpen(true)}
            className="!w-auto !bg-blue-600 !px-5 !py-3"
          >
            <Plus size={18} className="mr-2 inline" />
            Add booking
          </CustomButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Upcoming</p>
              <CalendarCheck className="text-emerald-600" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {
                bookings.filter((booking) => booking.status === "Approved")
                  .length
              }
            </p>
            <p className="mt-2 text-xs text-slate-500">Approved visits</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Awaiting review</p>
              <Clock3 className="text-amber-600" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {
                bookings.filter((booking) => booking.status === "Pending")
                  .length
              }
            </p>
            <p className="mt-2 text-xs text-slate-500">Pending requests</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total requests</p>
              <ReceiptText className="text-blue-600" size={20} />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {bookings.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">All booking activity</p>
          </div>
        </div>
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-950">Booking history</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a booking to see its full details.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    filter === item
                      ? "bg-slate-950 text-white"
                      : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-950"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <BookingTable
            bookings={visibleBookings}
            onCancel={requestCancelBooking}
            onEdit={editBooking}
            onView={setSelectedBooking}
          />
        </section>
      </div>
      {isFormOpen && (
        <CustomModal
          open={isFormOpen}
          onClose={closeBookingForm}
          title={editingBooking ? "Edit booking request" : "Add booking"}
        >
          <BookingForm
            onClose={closeBookingForm}
            onAdd={addBooking}
            onUpdate={saveBooking}
            initialBooking={editingBooking}
            isLoading={isBookingLoading}
          />
        </CustomModal>
      )}
      {bookingToCancel && (
        <CustomModal
          open
          onClose={() => setBookingToCancel(null)}
          title="Cancel booking request"
          loading={isBookingLoading}
        >
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Cancel the booking request for {bookingToCancel.space}?
            </p>
            <div className="flex justify-end gap-3">
              <CustomButton
                onclick={() => setBookingToCancel(null)}
                disabled={isBookingLoading}
                className="!w-auto !bg-slate-100 !px-5 !py-3 !text-black"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onclick={confirmCancelBooking}
                isLoading={isBookingLoading}
                className="!w-auto !bg-rose-600 !px-5 !py-3"
              >
                Confirm cancellation
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}
      {selectedBooking && (
        <BookingDetails
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
        />
      )}
      {isBookingLoading && (
        <Loader loadingName={"Loading Booking..."} />
      )}
    </AdminLayout>
  );
};

export default MyBookings;
