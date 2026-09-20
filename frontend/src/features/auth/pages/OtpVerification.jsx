"use client"
import CustomButton from '@/components/ui/button'
import { OtpInput, } from '@/components/ui/input/Input'
import { otpVerifySchema } from '@/lib/schema/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useOtpVerification } from '../hook/useOtpVerification'
import { forgotPasswordEmailSelector } from '../authSelectors'
import { useEffect, useState } from 'react'
import { useRouter } from '@/lib/router'
import { showToast } from '@/lib/toast'
import { useForgotPassword } from '../hook/useForgotPassword'

const OtpVerificationForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState()
  const forgotPasswordEmail = useSelector(forgotPasswordEmailSelector)
  const { otpVerify, isLoading } = useOtpVerification()

  const { forgotpassword, timeLeft } = useForgotPassword()

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formattedTime = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem("otpEmail") ?? null;

    setEmail(forgotPasswordEmail || sessionEmail)
  }, [forgotPasswordEmail])


  useEffect(() => {
    if (email === undefined) return;

    if (!email) {
      showToast.error("Please start the password reset process again.")
      router.replace("/forgot-password")
    }
    setValue("email", email || "")
  }, [email, router]);


  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      email: forgotPasswordEmail ?? "",
      otp: "",
    },
  })

  const otp = watch("otp", "")

  const sendOtpAgainHandler = async () => {
    if (!email) return

    await forgotpassword({ email: email })
  }

  return (
    <div className="w-full max-w-md">
  <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">

    {/* Header */}
    <div className="mb-8 text-center">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
        <Mail className="h-10 w-10 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900">
        Enter Verification Code
      </h1>

      <p className="mt-3 text-sm text-gray-500">
        We've sent a 6-digit verification code to
      </p>

      {email && (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <p className="break-all font-medium text-blue-700">
            {email}
          </p>
        </div>
      )}
    </div>

    {/* Form */}
    <form
      className="space-y-6"
      onSubmit={handleSubmit(otpVerify)}
    >
      <OtpInput
        value={otp}
        setValue={setValue}
        error={errors.otp?.message}
      />

      <CustomButton
        type="submit"
        isLoading={isLoading}
        className="group flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
      >
        <span className="flex items-center gap-2">
          Verify Email
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </CustomButton>
    </form>

    {/* Divider */}
    <div className="my-8 border-t border-gray-200"></div>

    {/* Footer */}
    <div className="text-center">
      <p className="text-sm text-gray-500">
        Didn't receive the code?
      </p>

      <button
        type="button"
        disabled={timeLeft > 0}
        onClick={timeLeft === 0 ? sendOtpAgainHandler : undefined}
        className={`mt-3 font-semibold transition-colors ${
          timeLeft === 0
            ? "cursor-pointer text-blue-600 hover:text-blue-700"
            : "cursor-not-allowed text-gray-400"
        }`}
      >
        Resend OTP
      </button>

      {timeLeft > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Resend available in{" "}
          <span className="font-semibold text-gray-700">
            {formattedTime}
          </span>
        </p>
      )}
    </div>
  </div>
</div>
  )
}

export default OtpVerificationForm