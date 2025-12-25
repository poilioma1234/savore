import React from 'react';
import { Layout } from 'antd';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  const headerHeight = showHeader ? 64 : 0;  // Header is typically 64px
  const footerHeight = showFooter ? 200 : 0; // Approximate footer height
  
  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', width: '100%', margin: 0, padding: 0 }}>
      {showHeader && <MainHeader />}
      <Content 
        style={{ 
          flex: 1,
          height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
          overflow: 'auto',
          margin: 0,
          padding: 0,
          background: '#FFFFFF'
        }}
      >
        {children}
      </Content>
      {showFooter && <MainFooter />}
    </Layout>
  );
};

export default MainLayout;
