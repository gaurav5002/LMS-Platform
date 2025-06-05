import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor


// API methods
export const registerUser = (userData) => axiosInstance.post('/signup', userData);
export const loginUser = (credentials) => axiosInstance.post('/login', credentials);
export const logoutUser = () => axiosInstance.post('/logout');
export const sendOtp = (email) => axiosInstance.post('/sendotp', { email });
export const verifyEmail = (email, otp) => axiosInstance.post('/verifyEmail', { email, otp });
export const resetPassword = (email, otp, newPassword) => 
  axiosInstance.post('/changepassword', { email, otp, newPassword });
export const getCurrentUser = () => axiosInstance.get('/me');
export const googleLogin = (token) => axiosInstance.post('/googleLogin', { token });
export const instructorRegister = (data) => axiosInstance.post('/instructor-register', data);

export default axiosInstance;
