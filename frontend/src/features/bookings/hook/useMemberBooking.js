import { useDispatch } from "react-redux";

import { showToast } from "@/lib/toast";
import {
  useCancelMemberBookingMutation,
  useCreateMemberBookingMutation,
  useGetMemberBookingsMutation,
  useUpdateMemberBookingMutation,
} from "@/features/api/memberbooking/bookingMemberApi";
import { setMemberBookings } from "@/features/api/memberbooking/bookingMemberSlice";
import { useGetSpaceDropDownMutation } from "@/features/api/space/spaceApi";
import { setGetSpaceDropDown } from "@/features/api/space/spaceSlice";

export function useMemberBooking() {
  const dispatch = useDispatch();
  const [getMemberBookings, { isLoading: isGetting }] = useGetMemberBookingsMutation();
  const [createBooking, { isLoading: isCreating }] = useCreateMemberBookingMutation();
  const [updateBookingRequest, { isLoading: isUpdating }] = useUpdateMemberBookingMutation();
  const [cancelBookingRequest, { isLoading: isCancelling }] = useCancelMemberBookingMutation();
  const [getSpaceDropDown, { isLoading: isFetchingSpaceDropDown }] = useGetSpaceDropDownMutation();

  const getMemberBooking = async (params) => {
    try {
      const response = await getMemberBookings(params).unwrap();
      const bookings = Array.isArray(response?.data) ? response.data : [];
      dispatch(setMemberBookings({
        data: bookings,
      }));
      return bookings;
    } catch (error) {
      showToast.error(error?.data?.message || "Unable to load bookings.");
      return [];
    }
  };

  const createNewBooking = async (payload) => {
    try {
      const response = await createBooking(payload).unwrap();
      showToast.success(response?.message || "Booking requested successfully.");
      await getMemberBooking()
      return true
    } catch (error) {
      showToast.error(error?.data?.message || "Unable to create booking.");
      return false;
    }
  };

  const updateBooking = async (id, payload) => {
    try {
      const response = await updateBookingRequest({ id, body: payload }).unwrap();
      showToast.success(response?.message || "Booking updated successfully.");
      await getMemberBooking()
      return true;
    } catch (error) {
      showToast.error(error?.data?.message || "Unable to update booking.");
      return false;
    }
  };

  const cancelBooking = async (id) => {
    try {
      const response = await cancelBookingRequest(id).unwrap();
      showToast.success(response?.message || "Booking cancelled successfully.");
      await getMemberBooking()
      return true;
    } catch (error) {
      showToast.error(error?.data?.message || "Unable to cancel booking.");
      return false;
    }
  };

  const fetchSpaceDropDown = async () => {
    try {
      const response = await getSpaceDropDown().unwrap();

      if (response && response.success) {
        dispatch(
          setGetSpaceDropDown({
            data: response.data,
          })
        );
      }
    } catch (error) {
      const err = error;
      const message = err?.data?.message || "Please try again.";
      showToast.error(message);
    }
  };



  return {
    getMemberBooking,
    createNewBooking,
    updateBooking,
    cancelBooking,
    fetchSpaceDropDown,
    isBookingLoading: isGetting || isCreating || isUpdating || isCancelling || isFetchingSpaceDropDown,
  };
}