import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi";
import authReducer from "../features/auth/authSlice";
import spaceReducer from "../features/api/space/spaceSlice";
import { spaceApi } from "../features/api/space/spaceApi";
import adminBookingReducer from "../features/api/booking/bookingAdminSlice";
import { bookingAdminApi } from "../features/api/booking/bookingAdminApi";
import maintenanceReducer from "../features/api/maintenance/maintenanceSlice";
import { maintenanceApi } from "../features/api/maintenance/maintenanceApi";
import memberBookingReducer from "../features/api/memberbooking/bookingMemberSlice";
import { bookingMemberApi } from "../features/api/memberbooking/bookingMemberApi";

const rootReducer = combineReducers({
    auth: authReducer,
    space: spaceReducer,
    adminBookng: adminBookingReducer,
    maintenance: maintenanceReducer,
    bookingMember: memberBookingReducer,
    [authApi.reducerPath]: authApi.reducer,
    [spaceApi.reducerPath]: spaceApi.reducer,
    [bookingAdminApi.reducerPath]: bookingAdminApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [bookingMemberApi.reducerPath]: bookingMemberApi.reducer,
})

export default rootReducer