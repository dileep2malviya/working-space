import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createMaintenanceState: null,
  tasks: [],
};

const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setCreateMaintenance: (state, action) => {
      state.createMaintenanceState = action.payload?.data ?? action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload ?? [];
    },
  },
});

export const { setCreateMaintenance, setTasks } = maintenanceSlice.actions;

export default maintenanceSlice.reducer;
