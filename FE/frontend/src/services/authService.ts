import { API_ENDPOINTS } from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, ApiError } from '../types/auth';

// Service xử lý authentication
export const authService = {
  // Đăng nhập
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng nhập thất bại');
    }

    return await response.json();
  },

  // Đăng ký
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng ký thất bại');
    }

    return await response.json();
  },

  // Làm mới token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Làm mới token thất bại');
    }

    return await response.json();
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};