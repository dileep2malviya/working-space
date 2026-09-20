import { useLoginUserMutation } from "../authApi"
import { useDispatch } from "react-redux"
import { setCredentials } from "../authSlice"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"
import { getRoleHome, getUserRole } from "../authSelectors"

export function useLogin() {
    const [loginUser, { isLoading }] = useLoginUserMutation()
    const dispatch = useDispatch()
    const router = useRouter()

    const login = async (payload) => {
        try {
            const response = await loginUser(payload).unwrap()
            const { user, accessToken } = response.data;

            sessionStorage.setItem("user", JSON.stringify(user))
            sessionStorage.setItem("accessToken", accessToken)

            dispatch(
                setCredentials({
                    user,
                    accessToken: accessToken,
                })
            );

            showToast.success(response.message)
            router.push(getRoleHome(getUserRole(user)))

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Login failed. Please try again.'

            showToast.error(message)
        }
    }

    return { login, isLoading }
}
