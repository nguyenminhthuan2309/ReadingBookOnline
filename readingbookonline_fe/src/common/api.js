export const API_GATEWAY = "http://localhost:3000";

const authAPI = {
  register: `${API_GATEWAY}/user/register`,
  login: `${API_GATEWAY}/auth/login`,
  forgotPassword: `${API_GATEWAY}/user/reset-password`,
  verifyOTP: `${API_GATEWAY}/user/verify-reset-password`,
  verifyCode: (code) => `${API_GATEWAY}/user/verify?token=${code}`,
};
const userAPI = {
  editUser: `${API_GATEWAY}/user`,
  changePassword: `${API_GATEWAY}/user/update-password`,
  getUsers: `${API_GATEWAY}/user`,
  trackUser: `${API_GATEWAY}/tracker/login`,
  getNotifications: (limit, page) =>
    `${API_GATEWAY}/book/notification?limit=${limit}&page=${page}`,
  recentLyRead: `${API_GATEWAY}/book/reading-history`,
  getRecentlyRead: (limit, page) =>
    `${API_GATEWAY}/book/reading-history?limit=${limit}&page=${page}`,
};

const bookAPI = {
  getBook: (limitNumber, pageNumber) =>
    `${API_GATEWAY}/book?limit=${limitNumber}&page=${pageNumber}&hasChapters=true`,
  getBookByUser: (limitNumber, pageNumber) =>
    `${API_GATEWAY}/book?limit=${limitNumber}&page=${pageNumber}`,
  getBookById: (id) => `${API_GATEWAY}/book/${id}`,
  getBookGenre: `${API_GATEWAY}/book/category?limit=42&page=1`,
  createBook: `${API_GATEWAY}/book`,
  editBook: (id) => `${API_GATEWAY}/book/${id}`,
  deleteBook: (id) => `${API_GATEWAY}/book/${id}`,
};

const chapterAPI = {
  createChapter: (bookId) => `${API_GATEWAY}/book/chapter/${bookId}`,
  getChapterById: (chapterId) => `${API_GATEWAY}/book/chapter/${chapterId}`,
  deleteChapter: (chapterId) => `${API_GATEWAY}/book/chapter/${chapterId}`,
  editChapter: (chapterId) => `${API_GATEWAY}/book/chapter/${chapterId}`,
};

const uploadAPI = {
  uploadImage: `${API_GATEWAY}/upload/image`,
  uploadFile: `${API_GATEWAY}/upload/file`,
};

const reviewAPI = {
  createReview: (bookId) => `${API_GATEWAY}/book/book-review/${bookId}`,
  getReview: (bookId, limit, page) =>
    `${API_GATEWAY}/book/book-review?bookId=${bookId}&limit=${limit}&page=${page}`,
  editReview: (reviewId) => `${API_GATEWAY}/book/book-review/${reviewId}`,
  deleteReview: (reviewId) => `${API_GATEWAY}/book/book-review/${reviewId}`,
};

const commentAPI = {
  createComment: (chapterId) =>
    `${API_GATEWAY}/book/chapter-comment/${chapterId}`,
  getComment: (chapterId, limit, page) =>
    `${API_GATEWAY}/book/chapter-comment?limit=${limit}&page=${page}&chapterId=${chapterId}`,
  editComment: (commentId) =>
    `${API_GATEWAY}/book/chapter-comment/${commentId}`,
  deleteComment: (commentId) =>
    `${API_GATEWAY}/book/chapter-comment/${commentId}`,
};

const adminAPI = {
  createManager: `${API_GATEWAY}/user/create-manager`,
  changeUserStatus: (userId) => `${API_GATEWAY}/user/status/${userId}`,
  changeBookStatus: (bookId) => `${API_GATEWAY}/book/${bookId}/status`,
  trackLogin: (timeRange) =>
    `${API_GATEWAY}/tracker/login/history/chart?timeRange=${timeRange}`,
};

export {
  authAPI,
  userAPI,
  bookAPI,
  chapterAPI,
  uploadAPI,
  reviewAPI,
  commentAPI,
  adminAPI,
};
