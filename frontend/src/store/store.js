import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '@/features/auth/authApi'
import { spaceApi } from '@/features/api/space/spaceApi'
import { bookingAdminApi } from '@/features/api/booking/bookingAdminApi'
import { bookingMemberApi } from '@/features/api/memberbooking/bookingMemberApi'
import { maintenanceApi } from '@/features/api/maintenance/maintenanceApi'

const store = configureStore({
    reducer: rootReducer,

     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        authApi.middleware,
        spaceApi.middleware,
        bookingAdminApi.middleware,
        bookingMemberApi.middleware,
        maintenanceApi.middleware
    ),
})

export default store