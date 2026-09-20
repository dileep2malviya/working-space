import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, MapPin, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CustomButton from "@/components/ui/button";
import { useGetSpaceDetails } from "@/features/admin/hook/space/useWorkSpace";
import { getSpaceDetailsSelector } from "@/features/api/space/spaceSelectors";
import CustomDateInput from "@/components/ui/input/CustomDateInput";
import Loader from "@/components/ui/Loader";

const SpaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const { fetchSpaceDetails, isLoading } = useGetSpaceDetails();
    const spaceDetails = useSelector(getSpaceDetailsSelector);
    const space = spaceDetails?.space ?? {};
    const bookings = spaceDetails?.bookings ?? [];

    useEffect(() => {
        if (id) {
            fetchSpaceDetails({ id, date: selectedDate });
        }
    }, [id, selectedDate]);

    const requestBooking = (booking) => {
        // The API should validate JWT ownership and enforce overlap constraints atomically.
        window.alert(
            `Booking request sent for ${booking.date}, ${booking.start} - ${booking.end}.`
        );
    };

    return (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-950"
            >
                <ArrowLeft size={16} />
                Back to spaces
            </button>

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <CalendarDays size={19} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-950">Availability</h2>
                            <p className="mt-1 text-sm text-slate-500">Select a date to see reserved times.</p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <CustomDateInput
                            labelText="Date"
                            min={today}
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                            isMandotry={false}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {bookings.length === 0 ? (
                            <div className="col-span-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50 px-4 py-5 text-center text-sm font-medium text-emerald-700">
                                No reservations for this date.
                            </div>
                        ) : bookings.map((booking) => (
                            <div
                                key={booking._id || `${booking.startTime}-${booking.endTime}`}
                                className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center text-xs font-bold text-rose-700"
                            >
                                {booking.startTime} - {booking.endTime}

                                <span className="mt-1 block text-[10px] font-medium">
                                    {booking.status || "Booked"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                            {space.type || "Workspace"}
                        </p>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${space.isActive === false ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                            {space.isActive === false ? "Unavailable" : "Available"}
                        </span>
                    </div>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                        {space.name || "Loading workspace"}
                    </h1>

                    <p className="mt-4 flex items-center gap-2 text-slate-500">
                        <MapPin size={17} />
                        {space.location || "Location not specified"}
                    </p>

                    <p className="mt-3 flex items-center gap-2 text-slate-500">
                        <Users size={17} />
                        Up to {space.capacity ?? "-"} people
                    </p>

                    <p className="mt-6 leading-7 text-slate-600">
                        {space.description || "No workspace description available."}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                        {(space.amenities ?? []).map((amenity) => (
                            <span
                                key={amenity}
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600"
                            >
                                {amenity}
                            </span>
                        ))}
                    </div>

                </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                

            </div>

            {isLoading && <Loader loadingName="Loading space details..." />}

        </section>
    );
};

export default SpaceDetails;