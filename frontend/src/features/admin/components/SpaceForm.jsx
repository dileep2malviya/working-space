import CustomButton from "@/components/ui/button";
import CustomMultiSelect from "@/components/ui/input/CustomMultiSelect";
import CustomSelect from "@/components/ui/input/CustomSelect";
import { CustomInput } from "@/components/ui/input/Input";
import { createSpaceSchema } from "@/lib/schema/spaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogActions } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateWorkSpace, useUpdateWorkSpace } from "../hook/space/useWorkSpace";

const defaultValues = {
    name: "",
    type: "Desk",
    capacity: 1,
    amenities: [],
    description: "",
    isActive: true,
};

const SpaceForm = ({ onClose, mode = "create", initialData = null }) => {
    const isEditMode = mode === "edit";
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createSpaceSchema),
        defaultValues,
    });

    const { createNewSpace, isLoading } = useCreateWorkSpace();
    const { updateWorkSpace, isLoadingUpdate } = useUpdateWorkSpace();

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                type: initialData.type || "Desk",
                capacity: initialData.capacity,
                amenities: initialData.amenities || [],
                description: initialData.description || "",
                isActive: initialData.isActive || true,
            });
        } else {
            reset(defaultValues);
        }
    }, [initialData, reset]);

    const onSubmitHandler = async (data) => {
        let isValid = false;

        if (isEditMode) {
            const id = initialData?._id
            isValid = await updateWorkSpace({ id, payload: data });
        } else {
            isValid = await createNewSpace(data);
        }

        if (isValid) {
            onClose();
        }
    };

    return (
        <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmitHandler)}
        >
            <CustomInput
                labelText="Space Name"
                placeholder="Meeting Room A"
                register={register("name")}
                error={errors.name?.message}
            />

            <CustomSelect
                name="type"
                control={control}
                label="Space Type"
                options={[
                    { label: "Desk", value: "Desk" },
                    { label: "Meeting Room", value: "Meeting Room" },
                ]}
                error={errors.type?.message}
            />

            <CustomInput
                type="number"
                labelText="Capacity"
                placeholder="10"
                register={register("capacity", {
                    valueAsNumber: true,
                })}
                error={errors.capacity?.message}
            />

            <CustomMultiSelect
                name="amenities"
                control={control}
                label="Amenities"
                options={[
                    "WiFi",
                    "Monitor",
                    "Whiteboard",
                    "Projector",
                    "Coffee",
                    "Printer",
                    "Air Conditioning",
                ]}
            />

            <CustomInput
                multiline
                rows={4}
                labelText="Description"
                placeholder="Describe this workspace..."
                register={register("description")}
                error={errors.description?.message}
                isMandotry={false}
            />

            {isEditMode && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                        Workspace status
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            {...register("isActive")}
                            className="h-4 w-4 accent-blue-600"
                        />

                        <label htmlFor="isActive" className="text-sm text-slate-700">
                            Active workspace
                        </label>
                    </div>
                </div>
            )}

        <DialogActions>
          <CustomButton
            onclick={onClose}
            className="!w-auto !bg-slate-100 !px-5 !py-3 !text-slate-700"
          >
            Cancel
          </CustomButton>

          <CustomButton
            type="submit"
            className="!w-auto !bg-blue-600 !px-5 !py-3"
                        isLoading={isEditMode ? isLoadingUpdate : isLoading}
          >
            {isEditMode ? "Update Space" : "Create Space"}
          </CustomButton>
        </DialogActions>
        </form>
    );
};

export default SpaceForm