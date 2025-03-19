import axios from "axios";

export const instance = axios.create({});

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

//Add token to header
export const setAuthorizationToken = (token) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

//Delet token in header
export const deleteAuthorizationToken = () => {
    delete instance.defaults.headers.common.Authorization;
};