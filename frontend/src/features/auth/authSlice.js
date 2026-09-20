import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    forgotPasswordEmail: null,
    verifiedUser: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user,
                state.accessToken = action.payload.accessToken
        },
        setForgotPasswordEmail: (state, action) => {
            state.forgotPasswordEmail = action.payload.email
        },
        clearForgotPasswordState: (state) => {
            state.forgotPasswordEmail = null
        },
        setAccountVerify: (state, action) => {
            state.verifiedUser = action.payload
        }
    }
})

export const { 
    setCredentials, 
    setForgotPasswordEmail,
    clearForgotPasswordState,
    setAccountVerify
} = authSlice.actions;

export default authSlice.reducer;

