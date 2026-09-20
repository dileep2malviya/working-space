import { Navigate, Route, Routes } from 'react-router-dom'
import LoginForm from '@/features/auth/pages/LoginForm'
import RegisterForm from '@/features/auth/pages/RegisterForm'
import ForgotPasswordForm from '@/features/auth/pages/ForgotPassword'
import OtpVerificationForm from '@/features/auth/pages/OtpVerification'
import ResetPasswordForm from '@/features/auth/pages/ResetPassword'
import AccountVerify from '@/features/auth/pages/AccountVerify'
import { AuthLayout } from './authRoutes.jsx'
import { PublicLayout } from './publicRoute.jsx'
import HeroSection from '@/features/spaces/components/HeroSection.jsx'
import SpaceDetails from '@/features/spaces/pages/SpaceDetails.jsx'
import ManageSpaces from '@/features/admin/pages/ManageSpaces.jsx'
import ManageBookings from '@/features/admin/pages/ManageBookings.jsx'
import Maintenance from '@/features/admin/pages/Maintenance.jsx'
import SpacesPage from '@/features/spaces/pages/SpacesPage.jsx'
import MyBookings from '@/features/bookings/pages/MyBookings.jsx'
import { PrivateRoute } from './privateRoute.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><HeroSection /></PublicLayout>} />
      <Route path="/spaces" element={<PublicLayout><SpacesPage /></PublicLayout>} />
      <Route path="/spaces/:id" element={<PublicLayout><SpaceDetails /></PublicLayout>} />
      <Route path="/spacedetails" element={<PublicLayout><SpaceDetails /></PublicLayout>} />
      {/* <Route path="/chat" element={<ChatApp />} /> */}
      <Route path="/login" element={<AuthLayout><LoginForm /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterForm /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordForm /></AuthLayout>} />
      <Route path="/reset-otp-verify" element={<AuthLayout><OtpVerificationForm /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPasswordForm /></AuthLayout>} />
      <Route path="/account-verify" element={<AuthLayout><AccountVerify /></AuthLayout>} />
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/spaces" element={<ManageSpaces />} />
        <Route path="/admin/bookings" element={<ManageBookings />} />
        <Route path="/admin/maintenance" element={<Maintenance />} />
      </Route>
      <Route element={<PrivateRoute allowedRoles={["member"]} />}>
        <Route path="/member/bookings" element={<MyBookings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes