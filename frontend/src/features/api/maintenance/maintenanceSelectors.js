const createMaintenanceSelector = (state) =>
  state.maintenance?.createMaintenanceState ?? null;

const getTasksSelector = (state) => state.maintenance?.tasks ?? [];

export { createMaintenanceSelector, getTasksSelector };
