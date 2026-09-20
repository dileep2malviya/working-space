import { Navigate, Outlet, useLocation } from "react-router-dom"
import { getSessionUser, getUserRole } from "@/features/auth/authSelectors"

const PrivateRoute = ({ allowedRoles = [] }) => {
  const location = useLocation()
  const accessToken = sessionStorage.getItem("accessToken")
  const user = getSessionUser()
  const role = getUserRole()?.toLowerCase()
  

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (allowedRoles.length && !allowedRoles.map((item) => item.toLowerCase()).includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : role === "member" ? "/member/bookings" : "/spaces"} replace />
  }

  return <Outlet />
}

export { PrivateRoute }