import { useForgotPasswordUserMutation } from "../authApi"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"
import { useDispatch } from "react-redux"
import { clearForgotPasswordState, setForgotPasswordEmail } from "../authSlice"
import { getExpireTimeForOtp, removeSessionStorageItems } from "@/utils/helpers"
import { useCountDown } from "./useCountDown"
import { useState } from "react"

export function useForgotPassword() {
    const [countdownTarget, setCountdownTarget] = useState(() => {
        const storedTarget = sessionStorage.getItem("otpResendAllowedAt")
        return storedTarget ? Number(storedTarget) : null
    })
    const [forgotPasswordUser, { isLoading }] = useForgotPasswordUserMutation()
    const router = useRouter()
    const dispatch = useDispatch()
    const timeLeft = useCountDown(countdownTarget)

    const forgotpassword = async (payload) => {

        if (getExpireTimeForOtp()) return
        const otpResendAllowedAt = sessionStorage.getItem("otpResendAllowedAt") ?? undefined

        const payloadObj = {
            ...payload,
            otpResendAllowedAt: otpResendAllowedAt
        }

        try {
            const response = await forgotPasswordUser(payloadObj).unwrap()
            const { data, success } = response

            if (data && success) {
                sessionStorage.setItem("otpEmail", data.email);
                sessionStorage.setItem(
                    "otpResendAllowedAt",
                    data.resendAllowedAt.toString()
                );

                dispatch(
                    setForgotPasswordEmail(payload)
                )
                setCountdownTarget(Number(data.resendAllowedAt))
                showToast.success(response.message)
                router.push("/reset-otp-verify")
            } else {
                dispatch(
                    clearForgotPasswordState()
                )

                removeSessionStorageItems(["otpEmail", "otpResendAllowedAt"])
                showToast.success(response.message)
            }

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'

            showToast.error(message)
        }
    }

    return { forgotpassword, timeLeft, isLoading }
}
