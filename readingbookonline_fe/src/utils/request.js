import axios from "axios";
import { ACCESS_TOKEN } from "./constants";
import { getItem } from "./localStorage";

export const instance = axios.create({});

instance.interceptors.request.use(
  async (config) => {
    const access_token = getItem(ACCESS_TOKEN);
    if (!access_token) {
      config.headers.Authorization = "";
    } else {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return error;
  }
);

export const getAPI = (url) => {
  return instance
    .get(url)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
export const postAPI = (url, options, config) => {
  return instance
    .post(url, options, config)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
export const putAPI = (url, options) => {
  return instance
    .put(url, options)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};

export const patchAPI = (url, options) => {
  return instance
    .patch(url, options)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};

export const deleteAPI = (url, options, config) => {
  return instance
    .delete(url, options, config)
    .then((res) => res)
    .catch((err) => {
      throw err;
    });
};
