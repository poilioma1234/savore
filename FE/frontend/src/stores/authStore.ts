import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/authService";

export interface AppUser {
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
}

interface Token {
  accessToken: string;
}

interface AuthState {
  user: AppUser | null;
  token: Token | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AppUser | null) => void;
  setToken: (token: Token | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  initializeAuth: () => void;
  login: (username: string, password: string, remember?: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        // Store token in localStorage for axios interceptors
        if (token?.accessToken) {
          localStorage.setItem('accessToken', token.accessToken);
        } else {
          localStorage.removeItem('accessToken');
        }
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      
      initializeAuth: () => {
        // Check localStorage first (for "remember me")
        let token = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        
        // If not in localStorage, check sessionStorage (for temporary sessions)
        if (!token) {
          token = sessionStorage.getItem('accessToken');
        }
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            get().setUser(user);
            get().setToken({ accessToken: token });
            get().setAuthenticated(true);
            
            // Special case for admin login - if username is "admin" and password is "admin", redirect directly to dashboard without API call
            if (usernameOrEmail === 'admin' && password === 'admin') {
              get().setUser({
                id: 'admin-id',
                username: 'admin',
                email: 'admin@example.com',
                role: 'ADMIN',
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
              get().setToken({ accessToken: 'admin-token' });
              get().setAuthenticated(true);
              localStorage.setItem('user', JSON.stringify({
                id: 'admin-id',
                username: 'admin',
                email: 'admin@example.com',
                role: 'ADMIN',
                status: 'ACTIVE',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }));
              localStorage.setItem('accessToken', 'admin-token');
              window.location.href = '/dashboard';
              return;
            }

            // Check if user is admin - if so, redirect to dashboard without API call
            if (user.role === 'ADMIN') {
              window.location.href = '/dashboard';
              return;
            }
          } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear invalid data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            sessionStorage.removeItem('accessToken');
          }
        }
      },
      
      login: async (usernameOrEmail: string, password: string, remember: boolean = true) => {
        set({ isLoading: true });
        
        // Check for admin login (username: "admin", password: "admin")
        // In this case, we don't need to call the API, just set the user as authenticated
        if (usernameOrEmail === 'admin' && password === 'admin') {
          get().setUser({
            id: 'admin-id',
            username: 'admin',
            email: 'admin@example.com',
            role: 'ADMIN',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          get().setToken({ accessToken: 'admin-token' });
          get().setAuthenticated(true);
          localStorage.setItem('user', JSON.stringify({
            id: 'admin-id',
            username: 'admin',
            email: 'admin@example.com',
            role: 'ADMIN',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }));
          localStorage.setItem('accessToken', 'admin-token');
          window.location.href = '/dashboard';
          return;
        }

        // Normal login flow
        try {
          const response = await authService.login({ 
            usernameOrEmail, // This will be sent as usernameOrEmail
            password 
          });
          const { user, accessToken } = response;
          
          get().setUser(user);
          get().setToken({ accessToken });
          get().setAuthenticated(true);
          
          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          
          // Only store token in localStorage if remember is checked
          if (remember) {
            localStorage.setItem('accessToken', accessToken);
          } else {
            // For non-remembered sessions, we can store in session storage instead
            sessionStorage.setItem('accessToken', accessToken);
          }
        } catch (error: unknown) {
          console.error('Login failed:', error);
          
          // Extract the error message from the backend response
          let errorMessage = 'Đăng nhập thất bại';
          const apiError = error as { response?: { data?: { error?: string; errors?: { msg: string }[] } } };
          
          if (apiError.response?.data?.error) {
            errorMessage = apiError.response.data.error;
          } else if (apiError.response?.data?.errors && apiError.response.data.errors.length > 0) {
            errorMessage = apiError.response.data.errors[0].msg;
          }
          
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.register({ username, email, password });
          const { user, accessToken } = response;
          
          // Convert backend response to match AppUser interface
          const fullUser: AppUser = {
            ...user,
            status: 'ACTIVE',
            updatedAt: new Date().toISOString()
          };
          
          get().setUser(fullUser);
          get().setToken({ accessToken });
          get().setAuthenticated(true);
          
          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(fullUser));
          
          // Default to remembering the user when they register
          localStorage.setItem('accessToken', accessToken);
        } catch (error: unknown) {
          console.error('Registration failed:', error);
          
          // Extract the error message from the backend response
          let errorMessage = 'Đăng ký thất bại';
          const apiError = error as { response?: { data?: { error?: string; errors?: { msg: string }[] } } };
          
          if (apiError.response?.data?.error) {
            errorMessage = apiError.response.data.error;
          } else if (apiError.response?.data?.errors && apiError.response.data.errors.length > 0) {
            errorMessage = apiError.response.data.errors[0].msg;
          }
          
          throw new Error(errorMessage);
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: () => {
        get().setUser(null);
        get().setToken(null);
        get().setAuthenticated(false);
        
        // Clear both localStorage and sessionStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
      },
      
      fetchProfile: async () => {
        if (!get().isAuthenticated) return;
        
        try {
          const response = await authService.getProfile();
          get().setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // If token is invalid, logout
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore token to localStorage after rehydration
        if (state?.token?.accessToken) {
          localStorage.setItem('accessToken', state.token.accessToken);
        }
        if (state?.user) {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      },
    }
  )
);
