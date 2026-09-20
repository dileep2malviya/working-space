const forgotPasswordEmailSelector = (state) =>
  state.auth.forgotPasswordEmail

const accountVerifySelector = (state) =>
  state.auth.verifiedUser

const userSelector = (state) => state.auth.user
const accessTokenSelector = (state) => state.auth.accessToken

const getSessionUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user") ?? "null")
  } catch {
    return null
  }
}

const getUserRole = () => {
  const user = getSessionUser()
  if(user) return user.role ? user.role : null
}

const getRoleHome = (role) => {
  switch (String(role ?? "").toLowerCase()) {
    case "admin":
      return "/admin/spaces"
    case "member":
      return "/member/bookings"
    case "visitor":
    default:
      return "/spaces"
  }
}

export { 
    forgotPasswordEmailSelector,
  accountVerifySelector,
  userSelector,
  accessTokenSelector,
  getUserRole,
  getRoleHome,
  getSessionUser
}