import React from 'react';
import { Layout, Button, Space, Typography, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const { Header } = Layout;
const { Text } = Typography;

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const publicMenuItems = [
    {
      label: 'Trang chủ',
      onClick: () => navigate('/home'),
    },
    {
      label: 'Danh sách',
      onClick: () => navigate('/list'),
    },
    {
      label: 'Video',
      onClick: () => navigate('/video'),
    },
    {
      label: 'Cửa hàng cá nhân',
      onClick: () => navigate('/shop'),
    },
  ];

  const authMenuItems = [
    {
      label: 'Trang chủ',
      onClick: () => navigate('/dashboard'),
    },
    {
      label: 'Danh sách',
      onClick: () => navigate('/list'),
    },
    {
      label: 'Video',
      onClick: () => navigate('/video'),
    },
    {
      label: 'Cửa hàng cá nhân',
      onClick: () => navigate('/shop'),
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  return (
    <Header
      style={{
        background: '#FF7A18',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '40px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/home')}
        >
          Savoré
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {(isAuthenticated ? authMenuItems : publicMenuItems).map((item) => (
            <div
              key={item.label}
              style={{
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '5px 10px',
                borderRadius: '4px',
                transition: 'background-color 0.3s',
              }}
              onClick={item.onClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Space>
          <Text style={{ color: 'white', marginRight: '8px' }}>
            Xin chào, {user?.fullName || user?.username}
          </Text>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: 'white' }}
            />
          </Dropdown>
        </Space>

      </div>
    </Header>
  );
};

export default MainHeader;
