export const API_GATEWAY = "http://localhost:3000";

const authAPI = {
  register: `${API_GATEWAY}/user/register`,
  login: `${API_GATEWAY}/auth/login`,
  forgotPassword: `${API_GATEWAY}/user/reset-password`,
  verifyOTP: `${API_GATEWAY}/user/verify-reset-password`,
  verifyCode: (code) => `${API_GATEWAY}/user/verify?token=${code}`,
};
const userAPI = {};

const bookAPI = {
  getBook: (limitNumber, pageNumber) =>
    `${API_GATEWAY}/book?limit=${limitNumber}&page=${pageNumber}`,
  getBookById: (id) => `${API_GATEWAY}/book/${id}`,
  getBookGenre: `${API_GATEWAY}/book/category?limit=42&page=1`,
  createBook: `${API_GATEWAY}/book`,
  editBook: (id) => `${API_GATEWAY}/book/${id}`,
  deleteBook: (id) => `${API_GATEWAY}/book/${id}`,
};

const chapterAPI = {
  createChapter: (bookId) => `${API_GATEWAY}/book/chapter/${bookId}`,
  getChapterById: (chapterId) => `${API_GATEWAY}/book/chatper/${chapterId}`,
};

const uploadAPI = {
  uploadImage: `${API_GATEWAY}/upload/image`,
  uploadFile: `${API_GATEWAY}/upload/file`,
};
export { authAPI, userAPI, bookAPI, chapterAPI, uploadAPI };
