import { CalendarCog, ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { useState } from "react";
import { convertDate } from "@/utils/helpers";

import CustomButton from "@/components/ui/button";

import AdminLayout from "../components/AdminLayout";
import MaintenanceForm from "../components/MaintenanceForm";
import StatusBadge from "../../../components/ui/StatusBadge";
import CustomModal from "@/components/ui/Modal";
import { useGetMaintenanceQuery } from "@/features/api/maintenance/maintenanceApi";
import Loader from "@/components/ui/Loader";

const Maintenance = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: maintenanceResponse, isLoading, isError } = useGetMaintenanceQuery({ page, limit });

  const responseData = maintenanceResponse?.data ?? maintenanceResponse;
  const maintenance = Array.isArray(responseData)
    ? responseData
    : responseData?.maintenance ?? [];
  const pagination = responseData?.pagination ?? {};
  const totalPages = Number(
    pagination.totalPages ??
      pagination.total_pages ??
      Math.ceil(Number(pagination.total ?? pagination.totalItems ?? maintenance.length) / limit)
  ) || 1;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Maintenance
            </h2>

            <p className="mt-2 text-slate-500">
              Plan work before it becomes a disruption for your guests.
            </p>
          </div>

          <CustomButton
            onclick={() => setIsFormOpen(true)}
            className="!w-auto !bg-violet-600 !px-5 !py-3"
          >
            <CalendarCog
              size={18}
              className="mr-2 inline"
            />
            Schedule work
          </CustomButton>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h3 className="font-bold text-slate-950">
              Upcoming maintenance
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Scheduled work across your spaces.
            </p>
          </div>

          <div className="divide-y divide-slate-100">

            {isError && (
              <p className="p-5 text-sm text-red-500">Unable to load maintenance records.</p>
            )}

            {!isLoading && !isError && maintenance.length === 0 && (
              <p className="p-5 text-sm text-slate-500">No maintenance records found.</p>
            )}

            {!isLoading && !isError && maintenance.map((task) => {
              const spaceName = task.space?.name || task.spaceName || (typeof task.space === "string" ? task.space : "Unknown space");
              const date = convertDate(task.maintenanceDate) || "TBD";

              return (
                <div
                  key={task._id || task.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Wrench size={19} />
                    </div>

                    <div>

                      <p className="font-semibold text-slate-700">
                        <strong>{spaceName}</strong>
                        <span className="ml-1">{date}</span>
                        {task.startTime && task.endTime
                          ? ` · ${task.startTime}–${task.endTime}`
                          : ""}
                      </p>

                      {task.space?.type && (
                        <p className="mt-1 text-xs text-slate-400">
                          {task.space.type} · Capacity: {task.space.capacity}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-400">
                        Description: {task.note || "Scheduled maintenance"}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={task.status || "Scheduled"} />
                </div>
              );
            })}
          </div>
          {isLoading && (
            <Loader loadingName="Loading maintenance records..." />
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                disabled={page === 1 || isLoading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                disabled={page >= totalPages || isLoading}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </div>

      {isFormOpen && (
        <CustomModal
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title="Schedule maintenance"
        >
          <MaintenanceForm
            onClose={() => setIsFormOpen(false)}
          />
        </CustomModal>
      )}
    </AdminLayout>
  );
};

export default Maintenance;