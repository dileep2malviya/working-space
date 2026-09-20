import React from 'react';
import StatusBadge from '@/components/ui/StatusBadge.jsx';
import { convertDate } from '@/utils/helpers';

const BookingDetails = ({ selectedBooking, setSelectedBooking }) => {
    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                  Booking details
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                  {selectedBooking.space}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-sm font-bold text-slate-400 hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-6 text-sm md:grid-cols-2">
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Request
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Status</p>
                    <div className="mt-1"><StatusBadge status={selectedBooking.status} /></div>
                  </div>
                  <div>
                    <p className="text-slate-500">Booking ID</p>
                    <p className="mt-1 break-all font-semibold text-slate-900">{selectedBooking.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Date</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Time</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.start} - {selectedBooking.end}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-slate-500">Notes</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.notes || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-5 md:border-t-0 md:pt-0">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Space
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Name</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.space}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Type</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.spaceDetails?.type || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Capacity</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.spaceDetails?.capacity ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Location</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.location || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-5 md:border-t-0 md:pt-0">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Member
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Name</p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {[selectedBooking.user?.firstName, selectedBooking.user?.lastName].filter(Boolean).join(" ") || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Email</p>
                    <p className="mt-1 break-all font-semibold text-slate-900">{selectedBooking.user?.email || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3 border-t border-slate-100 pt-5 md:border-t-0 md:pt-0">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Activity
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-500">Created</p>
                    <p className="mt-1 font-semibold text-slate-900">{convertDate(selectedBooking.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Last updated</p>
                    <p className="mt-1 font-semibold text-slate-900">{convertDate(selectedBooking.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cancelled at</p>
                    <p className="mt-1 font-semibold text-slate-900">{convertDate(selectedBooking.cancelledAt)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cancelled by</p>
                    <p className="mt-1 font-semibold text-slate-900">{selectedBooking.cancelledBy || "-"}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
    );
};

export default BookingDetails;
