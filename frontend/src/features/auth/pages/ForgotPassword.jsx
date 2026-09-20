import CustomButton from '@/components/ui/button'
import { CustomInput } from '@/components/ui/input/Input'
import { ForgotPasswordSchema } from '@/lib/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useForgotPassword } from '../hook/useForgotPassword'
import { Link } from 'react-router-dom'

const ForgotPasswordForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const {forgotpassword, isLoading} = useForgotPassword()
    const submitForgotPassword = (values) => {
        forgotpassword(values)
    }

    return (
        <div className="w-full max-w-md">
  <div className="rounded-3xl border border-gray-200 bg-white p-10 shadow-xl">

    <div className="mb-8 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
        <Mail size={40} className="text-white" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900">
        Forgot Password
      </h1>

      <p className="mt-3 text-gray-500 leading-relaxed">
        Enter the email address associated with your account. If an
        account exists, we'll send you a one-time verification code to
        reset your password.
      </p>
    </div>

    <form
      className="space-y-6"
      onSubmit={handleSubmit(submitForgotPassword)}
    >
      <CustomInput
        type="email"
        placeholder="Enter your email"
        register={register("email")}
        error={errors.email?.message}
        labelText="Email Address"
      />

      <CustomButton
        type="submit"
        isLoading={isLoading}
        className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
      >
        <div className="flex items-center justify-center gap-2">
          <span>Send Reset Code</span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </CustomButton>
    </form>

    <div className="mt-3 text-center">
      <p className="text-gray-500">
        Remember your password?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>
    </div>

  </div>
</div>
    )
}

export default ForgotPasswordForm