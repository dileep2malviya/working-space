import CustomButton from '@/components/ui/button'
import { CustomPasswordInput } from '@/components/ui/input/Input'
import { ResetPasswordSchema } from '@/lib/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useResetPassword } from '../hook/useResetPassword'
import { Link } from 'react-router-dom'

const ResetPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ResetPasswordSchema),
    });

    const { resetPassword, isLoading } = useResetPassword()

    return (
        <div className="w-full max-w-md">
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
                <Mail className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
                Reset Password
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
                Create a strong password for your account.
                Your new password must be different from your previous one.
            </p>
        </div>

        {/* Form */}
        <form
            className="space-y-5"
            onSubmit={handleSubmit(resetPassword)}
        >
            <CustomPasswordInput
                type="password"
                textLabel="New Password"
                register={register("newPassword")}
                error={errors.newPassword?.message}
                placeholder="Enter your new password"
            />

            <CustomPasswordInput
                type="password"
                textLabel="Confirm Password"
                register={register("confirmPassword")}
                error={errors.confirmPassword?.message}
                placeholder="Confirm your new password"
            />

            <CustomButton
                type="submit"
                isLoading={isLoading}
                className="group flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
            >
                Reset Password
            </CustomButton>
        </form>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Footer */}
        <div className="text-center">
            <p className="text-sm text-gray-500">
                Remember your password?
            </p>

            <Link
                to="/login"
                className="mt-2 inline-block font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
                Sign In
            </Link>
        </div>

    </div>
</div>
    )
}

export default ResetPasswordForm