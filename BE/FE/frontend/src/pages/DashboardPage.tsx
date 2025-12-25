import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to home page instead of showing dashboard
  useEffect(() => {
    // Add a small delay to ensure the redirect happens after the component is mounted
    const timer = setTimeout(() => {
      navigate("/home");
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f7fa',
    }}>
      <div style={{
        padding: '24px',
        textAlign: 'center',
      }}>
        <h2>Đang chuyển hướng...</h2>
      </div>
    </div>
  );
};

export default DashboardPage;