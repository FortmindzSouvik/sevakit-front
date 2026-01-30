import {
  clearProviderData,
  updateProviderTokens,
} from "@/redux/slices/providerSlice";
import { clearUserData, updateTokens } from "@/redux/slices/userSlice";
import store from "@/redux/store";
import axios from "axios";

export const axiosInst = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

const getUserTypeAndTokens = () => {
  const state = store.getState();

  // Check user is provider
  const providerData = state?.provider?.providerData;
  if (providerData?.accessToken && providerData?.id) {
    return {
      userType: "provider",
      accessToken: providerData.accessToken,
      refreshToken: providerData.refreshToken,
      userData: providerData,
    };
  }

  // Check if user is a patient
  const userData = state?.user?.userData;
  if (userData?.accessToken && userData?.id) {
    return {
      userType: "user",
      accessToken: userData.accessToken,
      refreshToken: userData.refreshToken,
      userData: userData,
    };
  }

  return null;
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const userInfo = getUserTypeAndTokens();
    if (userInfo?.accessToken) {
      config.headers.Authorization = `Bearer ${userInfo.accessToken}`;

      // config.headers["X-User-Type"] = userInfo.userType;
    }

    // Allow FormData requests to be sent correctly
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response) {
      const originalRequest = error.config;
      const userInfo = getUserTypeAndTokens();
      const refreshToken = userInfo?.refreshToken;
      const userType = userInfo?.userType;
      // console.log("refreshToken from apiClient", refreshToken);
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        refreshToken
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                resolve(apiClient(originalRequest));
              },
              reject: (err: any) => reject(err),
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const responseNewToken: any = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-tokens`,
            {
              refreshToken: refreshToken,
            },
            { transformResponse: (r) => r },
          );
          const parsedData = JSON.parse(responseNewToken.data);
          console.log("parsedData", parsedData);
          const newAccessToken = parsedData.access.token;
          const newRefreshToken = parsedData.refresh.token;

          if (userType === "provider") {
            store.dispatch(
              updateProviderTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              }),
            );
          } else {
            store.dispatch(
              updateTokens({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              }),
            );
          }

          processQueue(null, newAccessToken);
          // console.log("Updated tokens:", store.getState().user.userData);

          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return apiClient(originalRequest);
        } catch (err) {
          processQueue(err, null);
          if (userType === "provider") {
            store.dispatch(clearProviderData());
          } else {
            store.dispatch(clearUserData());
          }
          // Redirect to login based on user type
          // if (userType === "provider") {
          //   window.location.href = "/login";
          // } else {
          //   window.location.href = "/login";
          // }
          // window.location.href = "/login"; // Redirect on refresh failure
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else if (error.response?.status >= 500) {
        console.error("Server Error. Please try again later.");
      }
    } else if (error.response.status >= 500) {
      console.error("Server Error. Please try again later.");
    }

    return Promise.reject(error);
  },
);
