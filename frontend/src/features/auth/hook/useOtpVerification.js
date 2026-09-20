import { useForgotPasswordUserMutation, useOtpVerifyUserMutation } from "../authApi"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"

export function useOtpVerification() {
    const [otpVerifyUser, { isLoading }] = useOtpVerifyUserMutation()
    const [forgotPasswordUser] = useForgotPasswordUserMutation()
    const router = useRouter()

    const otpVerify = async (payload) => {
        try {
            const response = await otpVerifyUser(payload).unwrap()

            showToast.success(response.message)
            router.push('/reset-password')

        } catch (error) {
            const err = error
            const { statusCode, success } = err.data ?? {}

            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
            
            if (statusCode === 429 && !success) {
                router.push('/forgot-password')
            }
        }
    }

    const sentOtpAgainForResetPassword = async (payload) => {
        try {
            const response = await forgotPasswordUser(payload).unwrap()

            showToast.success(response.message)

            return { success: true }
        } catch (error) {
            const message =
                error?.data?.message || 'Login failed. Please try again.'

            showToast.error(message)

            return { success: false, error: message }
        }
    }


    return { otpVerify, sentOtpAgainForResetPassword, isLoading }
}
