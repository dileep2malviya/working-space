import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    createWorkSpaceState: null,
    getAllWorkSpaceState: null,
    getSpaceDropDownState: null,
    getSpaceDetailsState: null,
};

const workSpaceSlice = createSlice({
    name: "space",
    initialState,
    reducers: {
        setCreateWorkSpace: (state, action) => {
            state.createWorkSpaceState = action.payload.data
        },
        setGetAllWorkSpace: (state, action) => {
            state.getAllWorkSpaceState = action.payload.data
        },
        setGetSpaceDropDown: (state, action) => {
            state.getSpaceDropDownState = action.payload.data
        },
        setGetSpaceDetails: (state, action) => {
            state.getSpaceDetailsState = action.payload.data
        },
    }
})

export const {
    setCreateWorkSpace,
    setGetAllWorkSpace,
    setGetSpaceDropDown,
    setGetSpaceDetails,
} = workSpaceSlice.actions;

export default workSpaceSlice.reducer;

