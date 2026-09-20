import { CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import CustomButton from "@/components/ui/button";
import CustomDateInput from "@/components/ui/input/CustomDateInput";
import CustomSelect from "@/components/ui/input/CustomSelect";
import { CustomInput } from "@/components/ui/input/Input";
import { bookingSchema } from "@/lib/schema/bookingSchema";
import { useMemberBooking } from "@/features/bookings/hook/useMemberBooking";
import { getSpaceDropDownSelector } from "@/features/api/space/spaceSelectors";
import { useSelector } from "react-redux";
import { toInputDate } from "@/utils/helpers";



const BookingForm = ({ onClose, onAdd, onUpdate, initialBooking, isLoading = false }) => {
    const spaceDropDownData = useSelector(getSpaceDropDownSelector);
    const { fetchSpaceDropDown, isFetchingSpaceDropDown } = useMemberBooking();

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      space: String( initialBooking?.space ?? spaceDropDownData?.[0]?.value ?? ""),
      date: toInputDate(initialBooking?.bookingDate),
      start: initialBooking?.startTime || initialBooking?.start || "09:00",
      end: initialBooking?.endTime || initialBooking?.end || "10:00",
    },
  });

   useEffect(() => {
      fetchSpaceDropDown();
    }, []);


  const submit = async (form) => {
    const selectedSpace = spaceDropDownData.find(
      (space) => String(space.value) === String(form.space)
    ) ?? spaceDropDownData[0];

    const booking = {
      ...form,
      space: form.space,
      bookingDate: form.date,
      startTime: form.start,
      endTime: form.end,
      name: selectedSpace.name,
    };

    if (initialBooking && onUpdate) {
      const updated = await onUpdate({ ...initialBooking, ...booking });
      console.log("updated :: ", updated);
      if (updated === false) return;
    } else {
      const added = await onAdd(booking);
      if (added === false) return;
    }

    onClose();
  };

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
          min={new Date().toISOString().split("T")[0]}
          register={register("date")}
          error={errors.date?.message}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <CustomInput
            is24Hour
            labelText="Start time"
            register={register("start")}
            error={errors.start?.message}
          />

          <CustomInput
            is24Hour
            labelText="End time"
            register={register("end")}
            error={errors.end?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <CustomButton
          onclick={onClose}
          className="!w-auto !bg-slate-100 !px-5 !py-3 !text-black"
        >
          Cancel
        </CustomButton>

        <CustomButton
          type="submit"
          isLoading={isLoading}
          className="!w-auto !bg-blue-600 !px-5 !py-3"
        >
          <CalendarPlus size={17} className="mr-2 inline" />
          {initialBooking ? "Save changes" : "Request booking"}
        </CustomButton>
      </div>
    </form>
  );
};

export default BookingForm;
