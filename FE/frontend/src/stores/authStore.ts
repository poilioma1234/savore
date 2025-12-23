import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Token {
  accessToken: string;
  refreshToken: string;
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
  login: (accessToken: string, user: AppUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        // Store token in localStorage
        if (token?.accessToken) {
          localStorage.setItem('accessToken', token.accessToken);
          localStorage.setItem('refreshToken', token.refreshToken || '');
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),
      
      initializeAuth: () => {
        // Check localStorage first
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        
        if (accessToken && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user });
            set({ token: { accessToken, refreshToken: refreshToken || '' } });
            set({ isAuthenticated: true });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear invalid data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      },
      
      login: (accessToken, user) => {
        set({ user });
        set({ token: { accessToken, refreshToken: '' } });
        set({ isAuthenticated: true });
        
        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
      },
      
      logout: () => {
        set({ user: null });
        set({ token: null });
        set({ isAuthenticated: false });
        
        // Clear localStorage and sessionStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
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
          if (state.token.refreshToken) {
            localStorage.setItem('refreshToken', state.token.refreshToken);
          }
        }
        if (state?.user) {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
      },
    }
  )
);