import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = __DEV__ ? 'http://localhost:5029/api' : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  getAllUsers: () => api.get('/auth/users'),
};

export const courseService = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollCourse: (id) => api.post(`/courses/${id}/enroll`),
  getMyCourses: () => api.get('/courses/my-courses'),
  getInstructorCourses: () => api.get('/courses/instructor'),
  addLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons`, data),
  updateLesson: (courseId, lessonId, data) => api.put(`/courses/${courseId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId, lessonId) => api.delete(`/courses/${courseId}/lessons/${lessonId}`),
};

export const discussionService = {
  getDiscussions: (params) => api.get('/discussions', { params }),
  getDiscussion: (id) => api.get(`/discussions/${id}`),
  createDiscussion: (data) => api.post('/discussions', data),
  updateDiscussion: (id, data) => api.put(`/discussions/${id}`, data),
  deleteDiscussion: (id) => api.delete(`/discussions/${id}`),
  addComment: (id, data) => api.post(`/discussions/${id}/comments`, data),
  addReply: (id, commentId, data) => api.post(`/discussions/${id}/comments/${commentId}/reply`, data),
  pinDiscussion: (id, isPinned) => api.post(`/discussions/${id}/pin`, { isPinned }),
  resolveDiscussion: (id) => api.post(`/discussions/${id}/resolve`),
};

export const assessmentService = {
  getAssessments: (params) => api.get('/assessments', { params }),
  getAssessment: (id) => api.get(`/assessments/${id}`),
  createAssessment: (data) => api.post('/assessments', data),
  updateAssessment: (id, data) => api.put(`/assessments/${id}`, data),
  deleteAssessment: (id) => api.delete(`/assessments/${id}`),
  submitAssessment: (id, answers) => api.post(`/assessments/${id}/submit`, { answers }),
  getMySubmissions: () => api.get('/assessments/my-submissions'),
  getSubmission: (id) => api.get(`/assessments/submission/${id}`),
  getCourseAssessments: (courseId) => api.get(`/assessments/course/${courseId}`),
};

export const instructorService = {
  getInstructors: (params) => api.get('/instructors/instructors', { params }),
  getInstructorProfile: (userId) => api.get(`/instructors/profile/${userId}`),
  becomeInstructor: (data) => api.post('/instructors/become', data),
  updateInstructorProfile: (data) => api.put('/instructors/profile', data),
  getPendingInstructors: () => api.get('/instructors/pending'),
  approveInstructor: (id) => api.post(`/instructors/approve/${id}`),
  addQualification: (data) => api.post('/instructors/qualifications', data),
  addExperience: (data) => api.post('/instructors/experience', data),
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  updateDashboard: (data) => api.put('/analytics/dashboard', data),
  getUserAnalytics: (params) => api.get('/analytics/user', { params }),
  getCourseAnalytics: (courseId, params) => api.get(`/analytics/course/${courseId}`, { params }),
  trackView: (courseId) => api.post('/analytics/track', { courseId }),
  getOverview: () => api.get('/analytics/overview'),
};

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.post(`/notifications/read/${id}`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  sendBulkNotifications: (data) => api.post('/notifications/bulk', data),
};

export default api;