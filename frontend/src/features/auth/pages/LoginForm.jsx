import CustomButton from '@/components/ui/button'
import { CustomInput, CustomPasswordInput } from '@/components/ui/input/Input'
import { loginSchema } from '@/lib/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useLogin } from '../hook/useLogin'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const { login, isLoading } = useLogin()
    const submitLogin = (values) => login(values)

    return (
        <div className="w-full max-w-md">
            <div className="rounded-3xl bg-white border border-gray-200 shadow-xl p-10">

                <div className="text-center mb-8">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg mb-6">
                        <Mail size={40} className="text-white" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Sign in to continue booking your perfect workspace.
                    </p>
                </div>

                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(submitLogin)}
                >
                    <CustomInput
                        type="text"
                        placeholder="Enter your email"
                        register={register("email")}
                        error={errors.email?.message}
                        labelText="Email"
                    />

                    <CustomPasswordInput
                        type="password"
                        placeholder="Enter your password"
                        register={register("password")}
                        error={errors.password?.message}
                    />

                    <CustomButton
                        type="submit"
                        isLoading={isLoading}
                        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Login
                    </CustomButton>
                </form>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Register
                        </Link>
                    </p>

                    <Link
                        to="/forgot-password"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Forgot Password?
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default LoginForm