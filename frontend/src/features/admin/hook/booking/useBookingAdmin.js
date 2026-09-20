import { useDispatch } from "react-redux"
import { showToast } from "@/lib/toast"
import {
    useApproveBookingMutation,
    useGetAllBookingMutation,
    useRejectBookingMutation,
} from "@/features/api/booking/bookingAdminApi"
import {
    setGetAllBooking,
    updateBookingStatus,
} from "@/features/api/booking/bookingAdminSlice"

export function useGetAllWorkBookingAdmin() {
    const [getAllBooking, { isLoading }] = useGetAllBookingMutation()
    const [approveBooking, { isLoading: isApproving }] = useApproveBookingMutation()
    const [rejectBooking, { isLoading: isRejecting }] = useRejectBookingMutation()
    const dispatch = useDispatch()

    const getAllBookingByAdmin = async (payload) => {
        try {
            const response = await getAllBooking(payload).unwrap()

            if (response && response.success) {
                dispatch(
                    setGetAllBooking({
                        data: response.data
                    })
                )
            }

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
        }
    }

    const updateBooking = async (id, status) => {
        try {
            const updateRequest = status === "APPROVED"
                ? approveBooking
                : rejectBooking

            await updateRequest(id).unwrap()
            dispatch(updateBookingStatus({ id, status }))
            await getAllBookingByAdmin()
            showToast.success(`Booking ${status.toLowerCase()}.`)
            return true
        } catch (error) {
            const message = error?.data?.message || 'Please try again.'
            showToast.error(message)
            return false
        }
    }

    return {
        getAllBookingByAdmin,
        updateBooking,
        isLoading,
        isUpdating: isApproving || isRejecting,
    }
}