import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { useMenuStore } from '../stores/menuStore';

const { Sider } = Layout;
const { Title } = Typography;

const MenuComponent: React.FC = () => {
  const {
    menuItems,
    selectedKeys,
    openKeys,
    setSelectedKeys,
    setOpenKeys,
  } = useMenuStore();

  // Handle menu item click
  const handleMenuClick = (keys: any) => {
    setSelectedKeys(keys);
  };

  // Handle submenu expand/collapse
  const handleSubMenuClick = (keys: any) => {
    setOpenKeys(keys);
  };

  // Convert menu items to antd menu format
  const menuItemsFormatted = menuItems.map(item => {
    if (item.children && item.children.length > 0) {
      return {
        key: item.key,
        icon: item.icon,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.icon}
            <span>{item.label}</span>
          </span>
        ),
        children: item.children.map(child => ({
          key: child.key,
          icon: child.icon,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {child.icon}
              <span>{child.label}</span>
            </span>
          ),
        }))
      };
    }
    return {
      key: item.key,
      icon: item.icon,
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.icon}
          <span>{item.label}</span>
        </span>
      ),
      onClick: item.onClick || (() => {})
    };
  });

  return (
    <Sider
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ padding: '16px' }}>
        <Title level={4} style={{ color: '#FF7A18', marginBottom: '20px' }}>
          🍳 Menu
        </Title>
        
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onClick={handleMenuClick}
          onOpenChange={handleSubMenuClick}
          style={{ borderRight: 0 }}
          items={menuItemsFormatted}
        />
      </div>
    </Sider>
  );
};

export default MenuComponent;
