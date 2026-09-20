import { CalendarCog } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomButton from "@/components/ui/button";
import CustomDateInput from "@/components/ui/input/CustomDateInput";
import CustomSelect from "@/components/ui/input/CustomSelect";
import { CustomInput } from "@/components/ui/input/Input";
import { getSpaceDropDownSelector } from "@/features/api/space/spaceSelectors";
import { useCreateMaintenance } from "../hook/maintenance/useMaintenance";
import { createMaintenanceSchema } from "@/lib/schema/maintenanceSchema";
import { useMemberBooking } from "@/features/bookings/hook/useMemberBooking";

const MaintenanceForm = ({ onClose, onSave }) => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createMaintenanceSchema),
    defaultValues: {
      space: "",
      maintenanceDate: "",
      startTime: "09:00",
      endTime: "10:00",
      note: "",
    },
  });

  const spaceDropDownData = useSelector(getSpaceDropDownSelector);

  const { fetchSpaceDropDown, isFetchingSpaceDropDown } = useMemberBooking();
  const { createNewMaintenance, isLoading } = useCreateMaintenance(setError);

  useEffect(() => {
      fetchSpaceDropDown();
    }, []);

  const submit = async (form) => {
    const payload = {
      space: form.space,
      maintenanceDate: form.maintenanceDate,
      date: form.maintenanceDate,
      startTime: form.startTime,
      endTime: form.endTime,
      note: form.note?.trim() || "Scheduled maintenance",
    };

    const created = await createNewMaintenance(payload);

    if (!created) return;

    reset({
      space: "",
      maintenanceDate: "",
      startTime: "09:00",
      endTime: "10:00",
      note: "",
    });

    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
        <div className="space-y-4">
          <CustomSelect
          name="space"
          control={control}
          label="Space"
          isMandotry
          placeholder="Select a space"
          options={spaceDropDownData || []}
          disabled={isFetchingSpaceDropDown}
          error={errors.space?.message}
        />

          <CustomDateInput
            labelText="Date"
            min={today}
            register={register("maintenanceDate")}
            error={errors.maintenanceDate?.message}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <CustomInput
              is24Hour
              labelText="Start time"
              register={register("startTime")}
              error={errors.startTime?.message}
            />

            <CustomInput
              is24Hour
              labelText="End time"
              register={register("endTime")}
              error={errors.endTime?.message}
            />
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Notes

            <textarea
              rows={3}
              placeholder="What needs attention?"
              className={`mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100 ${errors.note ? "border-red-500" : ""}`}
              {...register("note")}
            />

            {errors.note?.message && (
              <p className="mt-1 text-sm font-normal text-red-500">
                {errors.note.message}
              </p>
            )}
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <CustomButton
            onclick={onClose}
            className="!w-auto !bg-slate-100 !px-5 !py-3 !text-slate-700"
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="submit"
            isLoading={isLoading}
            className="!w-auto !bg-violet-600 !px-5 !py-3"
          >
            <CalendarCog
              size={17}
              className="mr-2 inline"
            />
            Schedule
          </CustomButton>
        </div>
    </form>
  );
};

export default MaintenanceForm;
