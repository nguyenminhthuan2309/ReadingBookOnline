export const API_GATEWAY = "http://localhost:3000";

const authAPI = {
  register: `${API_GATEWAY}/user/register`,
  login: `${API_GATEWAY}/auth/login`,
};
const bookAPI = {
  getBook: (limitNumber, pageNumber) =>
    `${API_GATEWAY}/book?limit=${limitNumber}&page=${pageNumber}`,
  getBookById: (id) => `${API_GATEWAY}/book/${id}`,
};
export { authAPI, bookAPI };
