import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Plus,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import CustomButton from "@/components/ui/button";

import AdminLayout from "../components/AdminLayout";
import AdminStatCard from "../components/AdminStatCard";
import SpaceForm from "../components/SpaceForm";
import StatusBadge from "../../../components/ui/StatusBadge";
import CustomModal from "@/components/ui/Modal";
import { useSelector } from "react-redux";
import { createWorkSpaceSelector, getAllWorkSpaceSelector } from "@/features/api/space/spaceSelectors";
import { useGetAllWorkSpace } from "../hook/space/useWorkSpace";
import Loader from "@/components/ui/Loader";


const ManageSpaces = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const workSpacState = useSelector(getAllWorkSpaceSelector) ?? null;
  const createWorkSpacState = useSelector(createWorkSpaceSelector) ?? null;
  const { getAllWorkSpace, isLoading } = useGetAllWorkSpace();


  const spaceData = workSpacState?.data ?? workSpacState;
  const spaces = Array.isArray(spaceData)
    ? spaceData
    : spaceData?.workspaces ?? spaceData?.spaces ?? spaceData?.items ?? spaceData?.results ?? [];
  const pagination = spaceData?.pagination ?? {};
  const totalPages = Number(
    pagination.totalPages ??
      pagination.total_pages ??
      Math.ceil(Number(pagination.total ?? pagination.totalItems ?? spaces.length) / limit)
  ) || 1;

  const filteredSpaces = spaces.filter((space) =>
    `${space.name || ""} ${space.location || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const openCreateModal = () => {
    setSelectedSpace(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEditModal = (space) => {
    setSelectedSpace(space);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  useEffect(() => {
    getAllWorkSpace({ page, limit });
  }, [createWorkSpacState, page]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Manage spaces
            </h2>

            <p className="mt-2 text-slate-500">
              Keep your venues, capacity, and availability up to date.
            </p>
          </div>

          <CustomButton
            onclick={openCreateModal}
            className="!w-auto !bg-blue-600 !px-5 !py-3"
          >
            <Plus
              size={18}
              className="mr-2 inline"
            />
            Add space
          </CustomButton>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-bold text-slate-950">
                All spaces
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {filteredSpaces.length} listings in your inventory
              </p>
            </div>

            <label className="relative block">
              <Search
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search spaces"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-64"
              />
            </label>
          </div>

          <div className="divide-y divide-slate-100">
            

            {!isLoading && filteredSpaces.length === 0 && (
              <p className="p-5 text-sm text-slate-500">No spaces found.</p>
            )}

            {!isLoading && filteredSpaces.map((space) => (
              <div
                key={space._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {space.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {space.type} · {space.capacity}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(space.amenities || []).length > 0 ? (
                        (space.amenities || []).map((amenity, index) => (
                          <span
                            key={`${space._id || space.id}-amenity-${index}`}
                            className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          No amenities added
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <StatusBadge status={space.isActive ? "Active" : "Inactive"} />

                  <button
                    type="button"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    onClick={() => openEditModal(space)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

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
        {isLoading && (
              <Loader loadingName={"Loading Spaces..."} />
            )}
      </div>

      {isFormOpen && (
        <CustomModal
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={formMode === "edit" ? "Edit Workspace" : "Create Workspace"}
        >
          <SpaceForm
            mode={formMode}
            initialData={selectedSpace}
            onClose={() => setIsFormOpen(false)}
          />
        </CustomModal>
      )}
    </AdminLayout>
  );
};

export default ManageSpaces;