import { useRegisterUserMutation } from "../authApi"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"
import { applyServerErrors } from "@/utils/helpers"

export function useRegister(setError) {
    const [registerUser, { isLoading }] = useRegisterUserMutation()
    const router = useRouter()

    const userRegister = async (payload) => {
        try {
            const response = await registerUser(payload).unwrap()

            showToast.success(response.message)
            router.push('/login')

        } catch (error) {
            const err = error
            const data = err.data

            if (data?.errors && Object.keys(data.errors).length > 0) {
                applyServerErrors(data.errors, setError)
            }

            const message = data?.message || 'Please try again.'
            showToast.error(message)
        }
    }

    return { userRegister, isLoading }
}
