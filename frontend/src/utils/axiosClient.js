import axios from "axios";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000",
  headers: {
    'Content-Type': 'application/json',
  }
});

// Attach JWT to every request automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires, attempt to refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axiosClient.post('/auth/refresh-token', { refreshToken });
          
          if (response.data.statusCode === 200) {
            const { accessToken } = response.data.message;
            localStorage.setItem('token', accessToken);
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        }
      }
      
      // If refresh fails or no refresh token, log out
      localStorage.clear();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);