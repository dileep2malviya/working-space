import axios from "axios";

const baseURL = "https://working-space-2.onrender.com/api/v1/";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

const clearAuthSession = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
};

const refreshAccessToken = async () => {
  const response = await axios.post(
    `${baseURL}user/refresh-token`,
    {},
    { withCredentials: true }
  );

  console.log(" response :: ",response)

  const token =
    response?.data?.data?.accessToken ||
    response?.data?.accessToken ||
    response?.data?.token ||
    null;

  if (!token) {
    throw new Error("No access token returned from refresh endpoint");
  }

  sessionStorage.setItem("accessToken", token);
  return token;
};

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest.url?.includes("refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const accessToken = await refreshAccessToken();

        processQueue(null, accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;