import { useDispatch } from "react-redux";
import { showToast } from "@/lib/toast";
import { applyServerErrors } from "@/utils/helpers";
import { useCreateMaintenanceMutation } from "@/features/api/maintenance/maintenanceApi";
import { setCreateMaintenance } from "@/features/api/maintenance/maintenanceSlice";

export function useCreateMaintenance(setError) {
  const [createMaintenance, { isLoading }] = useCreateMaintenanceMutation();

  const dispatch = useDispatch();

  const createNewMaintenance = async (payload) => {
    try {
      const response = await createMaintenance(payload).unwrap();
      const data = response?.data ?? response;

      if (response && (response.success || response.data || response.message)) {
        showToast.success(response.message || "Maintenance saved successfully.");
        dispatch(
          setCreateMaintenance({
            data,
          })
        );
        return true;
      }

      return false;
    } catch (error) {
      const data = error?.data;

      if (data?.errors && Object.keys(data.errors).length > 0 && setError) {
        applyServerErrors(data.errors, setError);
      }

      const message = data?.message || "Please try again.";
      showToast.error(message);
      return false;
    }
  };

  return { createNewMaintenance, isLoading };
}
