import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

export const instance = axios.create({});

instance.interceptors.request.use(
  async (config) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);
    if (!access_token) {
      config.headers.Authorization = "";
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
    return response;
  },
  async (error) => {
    const { response } = error;
    if (response) {
      const { code } = response.data;

      switch (code) {
        case 401:
          window.location.href = "/";
          return Promise.reject(error);
        case 403:
          window.location.replace("/forbidden");
          return Promise.reject(error);
        case 404:
          window.location.replace("/not-found");
          return Promise.reject(error);
        case 400:
          console.log("network error", error);
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

export const getAPI = (url) => {
  return instance
    .get(url)
    .then((res) => res)
    .catch((err)   => {
      return Promise.reject(err);
    });
};
export const postAPI = (url, options, config) => {
  return instance
    .post(url, options, config)
    .then((res) => res)
    .catch((err) => {
      return Promise.reject(err);
    });
};
export const putAPI = (url, options) => {
  return instance
    .put(url, options)
    .then((res) => res)
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const patchAPI = (url, options) => {
  return instance
    .patch(url, options)
    .then((res) => res)
    .catch((err) => {
      return Promise.reject(err);
    });
};

export const deleteAPI = (url, options, config) => {
  return instance
    .delete(url, options, config)
    .then((res) => res)
    .catch((err) => {
      return Promise.reject(err);
    });
};
