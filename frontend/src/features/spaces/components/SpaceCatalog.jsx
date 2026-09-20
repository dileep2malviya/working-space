import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useGetAllWorkSpace } from "@/features/admin/hook/space/useWorkSpace";
import { useSelector } from "react-redux";
import { getAllWorkSpaceSelector } from "@/features/api/space/spaceSelectors";
import CustomDateInput from "@/components/ui/input/CustomDateInput";
import CustomSelect from "@/components/ui/input/CustomSelect";
import { CustomInput } from "@/components/ui/input/Input";
import Loader from "@/components/ui/Loader";

const pageSize = 10;
const fallbackImage =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80";

const getSpaceRecords = (response) => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.spaces ?? data?.workspaces ?? data?.items ?? data?.results ?? [];
};

const toSpaceView = (space) => ({
  ...space,
  id: space._id || space.id,
  type: space.type || "Space",
  capacity: Number(space.capacity || 0),
  image: space.image || fallbackImage,
  amenities: space.amenities || [],
});

const SpaceCatalog = () => {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const { control, watch } = useForm({
    defaultValues: {
      type: "All types",
      capacity: "Any capacity",
    },
  });
  const type = watch("type");
  const capacity = watch("capacity");

  const { getAllWorkSpace, isLoading } = useGetAllWorkSpace();
  const getAllWorkSpaceData = useSelector(getAllWorkSpaceSelector);

  console.log(getAllWorkSpaceData);

  useEffect(() => {
    getAllWorkSpace({ page, limit: 10, date });
  }, [page, date]);

  const spaces = useMemo(() => {
    return getSpaceRecords(getAllWorkSpaceData).map(toSpaceView);
  }, [getAllWorkSpaceData]);

  const filteredSpaces = useMemo(() => {
    return spaces.filter((space) => {
      const matchesQuery = `${space.name} ${space.type}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesType =
        type === "All types" || space.type.toLowerCase() === type.toLowerCase();

      const matchesCapacity =
        capacity === "Any capacity"
          ? true
          : capacity === "1-4"
            ? space.capacity <= 4
            : capacity === "5-12"
              ? space.capacity >= 5 && space.capacity <= 12
              : space.capacity > 12;

      return (
        matchesQuery &&
        matchesType &&
        matchesCapacity
      );
    });
  }, [spaces, capacity, query, type]);

  const pageCount = Math.max(
    1,
    getAllWorkSpaceData?.pagination?.totalPages ??
    Math.ceil(filteredSpaces.length / pageSize)
  );

  const visibleSpaces = filteredSpaces;

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  // useEffect(() => {
  //   setPage(1);
  // }, [capacity, type]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="relative">

            <CustomInput
              isMandotry={false}
              value={query}
              onChange={updateFilter(setQuery)}
              placeholder="Search by space name"
              labelCss="!mb-0"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <CustomSelect
            name="type"
            control={control}
            options={[
              { value: "All types", label: "All types" },
              { value: "Desk", label: "Desk" },
              { value: "Meeting room", label: "Meeting room" },
            ]}
            placeholder="Type"
          />

          <CustomSelect
            name="capacity"
            control={control}
            options={[
              { value: "Any capacity", label: "Any capacity" },
              { value: "1-4", label: "1-4 people" },
              { value: "5-12", label: "5-12 people" },
              { value: "13+", label: "13+ people" },
            ]}
            placeholder="Capacity"
          />

          <label className="relative">

            <CustomDateInput
              isMandotry={false}
              type="date"
              value={date}
              labelCss="!mb-0"
              onChange={updateFilter(setDate)}
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleSpaces.map((space) => (
          <article
            key={space.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {space.type}
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-950">
                    {space.name}
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  Available
                </span>
              </div>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Users size={16} />
                Up to {space.capacity} people
              </p>

              <Link
                to={`/spaces/${space.id}`}
                className="mt-5 block rounded-xl bg-slate-950 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
              >
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {isLoading && (
        <Loader loadingName={"Loading spaces..."}/>
      )}

      {!isLoading && visibleSpaces.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-500">
          No spaces match those filters.
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-sm font-semibold text-slate-600">
          Page {page} of {pageCount}
        </span>

        <button
          type="button"
          disabled={page === pageCount}
          onClick={() => setPage(page + 1)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default SpaceCatalog;