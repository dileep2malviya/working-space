import BookingCard from "./BookingCard";

const BookingTable = ({
  bookings,
  onCancel,
  onEdit,
  onView,
}) => {
  return (
    <div className="space-y-4">
      {bookings.length ? (
        bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            onCancel={onCancel}
            onEdit={onEdit}
            onView={onView}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-500">
          No bookings match this filter.
        </div>
      )}
    </div>
  );
};

export default BookingTable;