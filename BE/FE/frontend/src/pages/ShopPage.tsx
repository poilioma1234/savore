import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const ShopPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Cửa hàng cá nhân</Title>
      <p>This is a placeholder for the Personal Shop page.</p>
    </div>
  );
};

export default ShopPage;
