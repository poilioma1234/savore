import React from "react";
import { Typography } from "antd";
import { useAuthStore } from "@/stores/authStore";

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div
      style={{
        padding: "24px",
        height: "100%",
        width: "100%",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        boxSizing: "border-box"
      }}
    >
      <Title level={2}>Dashboard</Title>
      <p>Xin chào, {user?.fullName || user?.username}!</p>
    </div>
  );
};

export default DashboardPage;