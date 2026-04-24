import API from './axios';

export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (userData) => API.post('/auth/register', userData);
export const getProfile = () => API.get('/auth/profile');
export const logout = () => API.post('/auth/logout');

export default {
  login,
  signup,
  getProfile,
  logout
};
