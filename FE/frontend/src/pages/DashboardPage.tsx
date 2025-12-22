import React from "react";
import { Typography, Button, Layout, Menu } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Profile",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title
            level={4}
            style={{
              color: "white",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            SaaS WMS
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          style={{
            background: "transparent",
          }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <div>
            <Text strong>Chào mừng trở lại!</Text>
          </div>
          <div>
            <Text style={{ marginRight: "16px" }}>
              {user?.fullName || user?.username}
            </Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
          }}
        >
          <Title level={2}>Dashboard</Title>
          <Text>
            Welcome to the SaaS WMS Dashboard! This is a placeholder for your
            dashboard content.
          </Text>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
