import axiosInstance from './axios';

export const axiosBaseQuery = () => async ({
    url,
    method = "GET",
    data,
    params
}) => {
    try {
        const result = await axiosInstance({
            url,
            method,
            data,
            params,
        })
        return { data: result.data }
    } catch (error) {
        const axiosError = error;
        return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        },
      };
    }
}