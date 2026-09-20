const createWorkSpaceSelector = (state) =>
  state.space?.createWorkSpaceState ?? null

const getAllWorkSpaceSelector = (state) =>
  state.space?.getAllWorkSpaceState ?? null

const getSpaceDropDownSelector = (state) =>
  state.space?.getSpaceDropDownState ?? null

const getSpaceDetailsSelector = (state) =>
  state.space?.getSpaceDetailsState ?? null

export {
  createWorkSpaceSelector,
  getAllWorkSpaceSelector,
  getSpaceDropDownSelector,
  getSpaceDetailsSelector
}


