import { axiosClient } from "@/api/axiosClient";

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    fullName?: string;
    bio?: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  };
  accessToken: string;
}

interface ProfileResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    fullName?: string;
    bio?: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      // Send the field as usernameOrEmail to the backend
      const loginData = {
        usernameOrEmail: data.usernameOrEmail,
        password: data.password
      };
      
      const response = await axiosClient.post<LoginResponse>("/api/auth/login", loginData);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await axiosClient.post<RegisterResponse>("/api/auth/register", data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axiosClient.get<ProfileResponse>("/api/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      // Clear the token from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
};
