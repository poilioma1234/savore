import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const MainFooter: React.FC = () => {
  return (
    <Footer
      style={{
        background: '#8D6E63',
        textAlign: 'center',
        padding: '16px 0',
      }}
    >
      <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
        © Savoré. Hutech IT Got Talent 2025.
      </Text>
    </Footer>
  );
};

export default MainFooter;
