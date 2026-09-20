import { useDispatch } from "react-redux"
import { useRouter } from '@/lib/router'
import { showToast } from "@/lib/toast"
import { useCreateSpaceMutation, useGetAllSpaceMutation, useGetSpaceDetailsMutation, useUpdateSpaceMutation } from "@/features/api/space/spaceApi"
import { setCreateWorkSpace, setGetAllWorkSpace, setGetSpaceDetails } from "@/features/api/space/spaceSlice"

export function useCreateWorkSpace() {
    const [createSpace, { isLoading }] = useCreateSpaceMutation()
    const dispatch = useDispatch()
    const router = useRouter()

    const createNewSpace = async (payload) => {
        try {
            const response = await createSpace(payload).unwrap()

            if (response && response.success) {
                showToast.success(response.message)
                 dispatch(
                    setCreateWorkSpace({
                        data: response.data
                    })
                    
                )
                return true
            }


        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
            return false
        }
    }

    return { createNewSpace, isLoading }
}

export function useGetAllWorkSpace() {
    const [getAllSpace, { isLoading }] = useGetAllSpaceMutation()
    const dispatch = useDispatch()

    const getAllWorkSpace = async (payload) => {
        try {
            const response = await getAllSpace(payload).unwrap()

            if (response && response.success) {
                dispatch(
                    setGetAllWorkSpace({
                        data: response.data
                    })
                )
            }

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
        }
    }

    return { getAllWorkSpace, isLoading }
}

export function useUpdateWorkSpace() {
    const [updateSpace, { isLoading: isLoadingUpdate }] = useUpdateSpaceMutation()
    const dispatch = useDispatch()

    const updateWorkSpace = async ({ id, payload }) => {
        try {
            const response = await updateSpace({ id, body: payload }).unwrap()

            if (response && response.success) {
                showToast.success(response.message)
                dispatch(
                    setCreateWorkSpace({
                        data: response.data
                    })
                )
                return true
            }

            return false
        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
            return false
        }
    }

    return { updateWorkSpace, isLoadingUpdate  }
}

export function useGetSpaceDropDown() {
    const [getSpaceDropDown, { isLoading }] = useGetSpaceDropDownMutation()
    const dispatch = useDispatch()

    const fetchSpaceDropDown = async () => {
        try {
            const response = await getSpaceDropDown().unwrap()

            if (response && response.success) {
                dispatch(
                    setGetSpaceDropDown({
                        data: response.data
                    })
                )
            }

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
        }
    }

    return { fetchSpaceDropDown, isLoading }
}

export function useGetSpaceDetails() {
    const [getSpaceDetails, { isLoading }] = useGetSpaceDetailsMutation()
    const dispatch = useDispatch()

    const fetchSpaceDetails = async ({ id, date }) => {
        try {
            const response = await getSpaceDetails({ id, date }).unwrap()

            if (response && response.success) {
                dispatch(
                    setGetSpaceDetails({
                        data: response.data
                    })
                )
            }

        } catch (error) {
            const err = error
            const message = err?.data?.message || 'Please try again.'
            showToast.error(message)
        }
    }

    return { fetchSpaceDetails, isLoading }
}
