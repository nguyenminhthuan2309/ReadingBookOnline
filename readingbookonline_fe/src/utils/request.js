import axios from "axios";
import { ACCESS_TOKEN, ERROR, EXPIRED_IN, USER_INFO } from "./constants";
import { ShowNotify } from "@/components/Notification";

export const instance = axios.create({});

instance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    const user_info = localStorage.getItem(USER_INFO);
    const expired_in = localStorage.getItem(EXPIRED_IN);
    if (!access_token || !user_info || !expired_in) {
      config.headers.Authorization = "";
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(USER_INFO);
      localStorage.removeItem(EXPIRED_IN);
    } else {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    const { response } = error;
    if (response) {
      const { code } = response.data;
      if (code === 404) {
        window.location.replace("/error-network");
        return Promise.reject(error);
      }
    } else {
      console.error("Network Error:", error);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async (response) => {
    const expiresIn = localStorage.getItem(EXPIRED_IN);
    const now = new Date().getTime();
    const nowInSeconds = Math.floor(now / 1000);
    const isExpired = expiresIn && nowInSeconds > expiresIn;
    if (isExpired) {
      localStorage.clear();
      await ShowNotify(ERROR, "Token expired, please login again");
      window.location.href = "/";
    }
    return response;
  },
  async (error) => {
    const { response } = error;
    if (response) {
      const { code } = response.data;

      switch (code) {
        case 401:
          await ShowNotify(ERROR, "Unauthorized");
          window.location.href = "/";
          return Promise.reject(error);
        case 403:
          window.location.replace("/forbidden");
          console.log("here request error", error);
          return Promise.reject(error);
        case 404:
          window.location.replace("/not-found");
          return Promise.reject(error);
        case 400:
          console.log("network error", error);
          // window.location.replace("/error-network");
          return Promise.reject(error);
        case 500:
          window.location.replace("/error-network");
          return Promise.reject(error);
        default:
          console.error("Network Error:", error);
          return Promise.reject(error);
      }
    } else {
      console.error("Network Error:", error);
      return Promise.reject(error);
    }
  }
);

export const getAPI = (url, config = {}) => {
  return instance
    .get(url, config)
    .then((res) => res)
    .catch((err) => handleAPIError(err));
};

export const postAPI = (url, data, config = {}) => {
  return instance
    .post(url, data, config)
    .then((res) => res)
    .catch((err) => handleAPIError(err));
};

export const putAPI = (url, data, config = {}) => {
  return instance
    .put(url, data, config)
    .then((res) => res)
    .catch((err) => handleAPIError(err));
};

export const patchAPI = (url, data, config = {}) => {
  return instance
    .patch(url, data, config)
    .then((res) => res)
    .catch((err) => handleAPIError(err));
};

export const deleteAPI = (url, config = {}) => {
  return instance
    .delete(url, config)
    .then((res) => res)
    .catch((err) => handleAPIError(err));
};

// ✅ Common Error Handling Function
const handleAPIError = (err) => {
  console.error("API Error:", err.response?.status, err.message);
  return err.response ? Promise.reject(err.response) : Promise.reject(err);
};
