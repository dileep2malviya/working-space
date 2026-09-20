import { useResetPasswordUserMutation } from "../authApi"
import { useDispatch } from "react-redux"
import { clearForgotPasswordState } from "../authSlice"
import { showToast } from "@/lib/toast"
import { removeSessionStorageItems } from "@/utils/helpers"
import { useRouter } from '@/lib/router'

export function useResetPassword() {
    const [resetPasswordUser, { isLoading }] = useResetPasswordUserMutation()
    const dispatch = useDispatch()
    const router = useRouter()
    const resetPassword = async (payload) => {
        try {
            const response = await resetPasswordUser(payload).unwrap()
            dispatch(
                clearForgotPasswordState()
            )

            removeSessionStorageItems(["otpEmail", "otpResendAllowedAt"])

            showToast.success(response.message)
            router.push('/login')

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'

            showToast.error(message)
        }
    }

    return { resetPassword, isLoading }
}
