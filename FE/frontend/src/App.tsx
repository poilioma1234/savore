import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { App as AntApp } from 'antd'
import HomePage from '@/pages/HomePage'
import DashboardPage from '@/pages/DashboardPage'
import { useAuthStore } from '@/stores/authStore'
import './App.css'
import LoginPage from './pages/auth/login/LoginPage'
import RegisterPage from './pages/auth/register/RegisterPage'
import MainLayout from '@/components/layout/MainLayout'
import ListPage from '@/pages/ListPage'
import VideoPage from '@/pages/VideoPage'
import ShopPage from '@/pages/ShopPage'

// AuthRoute component to protect routes
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// PublicRoute component to redirect authenticated users away from auth pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return (
    <AntApp>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route 
            path="/home" 
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <MainLayout showHeader={false}>
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              </MainLayout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <MainLayout showHeader={false}>
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              </MainLayout>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <MainLayout>
                <AuthRoute>
                  <DashboardPage />
                </AuthRoute>
              </MainLayout>
            } 
          />
          <Route 
            path="/list" 
            element={
              <MainLayout>
                <ListPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/video" 
            element={
              <MainLayout showFooter= {false}>
                <VideoPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/video/:id" 
            element={
              <MainLayout showFooter= {false}>
                <VideoPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/shop" 
            element={
              <MainLayout>
                <ShopPage />
              </MainLayout>
            } 
          />
        </Routes>
      </Router>
    </AntApp>
  )
}

export default App