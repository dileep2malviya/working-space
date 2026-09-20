import { useAccountVerifyUserMutation, useAgainAccountVerifyUserMutation } from "../authApi"
import { useDispatch } from "react-redux"
import { setAccountVerify } from "../authSlice"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"

export function useAccountVerify() {
    const [accountVerifyUser, { isLoading: isVerifying }] = useAccountVerifyUserMutation()
    const [againAccountVerifyUser, { isLoading: isResending }] = useAgainAccountVerifyUserMutation()
    const dispatch = useDispatch()
    const router = useRouter()

    const accountVerify = async (payload) => {
        try {
            const response = await accountVerifyUser(payload).unwrap()

            console.log("Account verification response:", response)

            if (response && response.data) {
                dispatch(
                    setAccountVerify({
                        error: false,
                        data: response.message,
                    })
                )
            }

            showToast.success(response.message)
            router.replace('/account-verify')

        } catch (error) {
            const err = error
            const data = err.data
            console.error("Account verification error:", err)
            dispatch(
                setAccountVerify({
                    error: true,
                    data: err.data?.message || 'Verification failed. Please try again.',
                })
            )
            if (data?.errors && data.errors.message === "jwt expired") {
                showToast.error("Verification token has expired. Please request a new verification email.")
            } else {
                const message = err?.data?.message || 'Verification failed. Please try again.'
                showToast.error(message)
            }
        }
    }
    const againAccountVerify = async (payload) => {
        try {
            const response = await againAccountVerifyUser(payload).unwrap()

            showToast.success(response.message)
            router.push('/login')

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Verification failed. Please try again.'
            showToast.error(message)
        }
    }

    return { accountVerify, againAccountVerify, isVerifying, isResending }
}
