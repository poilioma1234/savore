import React, { useState } from 'react';
import { Card, Avatar, Typography, Button, Space, Row, Col, Badge } from 'antd';
import {
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useMenuStore } from '../stores/menuStore';

const { Title, Text } = Typography;

interface Recipe {
  id: number;
  name: string;
  imageUrl: string;
  author: string;
  authorAvatar: string;
  likes: number;
  comments: number;
  category: string;
  time?: string;
  description?: string;
}

// Mock data for recipes
const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Phở Bò Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e906?w=500&h=300&fit=crop',
    author: 'Chef Hải',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    likes: 542,
    comments: 87,
    category: 'main',
    time: 'Buổi sáng',
    description: 'Phở bò thơm ngon đậm Đà với tái bò mềm mại'
  },
  {
    id: 2,
    name: 'Bún Chả Hà Nội',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7244?w=500&h=300&fit=crop',
    author: 'Chef Minh',
    authorAvatar: 'https://i.pravatar.cc/150?img=12',
    likes: 423,
    comments: 65,
    category: 'main',
    time: 'Buổi trưa',
    description: 'Bún chả thơm lừng với nem lụi và chả cốm'
  },
  {
    id: 3,
    name: 'Gỏi Cuốn Tôm Thịt',
    imageUrl: 'https://images.unsplash.com/photo-1567620905745-e54ca88290dd2?w=500&h=300&fit=crop',
    author: 'Chef Lan',
    authorAvatar: 'https://i.pravatar.cc/150?img=13',
    likes: 389,
    comments: 53,
    category: 'side',
    time: 'Buổi tối',
    description: 'Gỏi cuốn tươi ngon với tôm và thịt ba chỉ'
  },
  {
    id: 4,
    name: 'Trà Cam Sả Chanh',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-75ba5384821a4?w=500&h=300&fit=crop',
    author: 'Chef Hùng',
    authorAvatar: 'https://i.pravatar.cc/150?img=14',
    likes: 256,
    comments: 42,
    category: 'drink',
    time: 'Buổi trưa',
    description: 'Trà cam sả chanh mát lạnh giải nhiệt'
  },
  {
    id: 5,
    name: 'Nộm Đu Đủ',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e906?w=500&h=300&fit=crop',
    author: 'Chef Mai',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    likes: 198,
    comments: 31,
    category: 'side',
    time: 'Buổi tối',
    description: 'Nộm đu đủ giòn tan với đu đủ xanh'
  },
  {
    id: 6,
    name: 'Cơm Tấm Sườn',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e906?w=500&h=300&fit=crop',
    author: 'Chef Quân',
    authorAvatar: 'https://i.pravatar.cc/150?img=16',
    likes: 678,
    comments: 92,
    category: 'main',
    time: 'Buổi sáng',
    description: 'Cơm tấm sườn nướng thơm ngon'
  },
  {
    id: 7,
    name: 'Chè Khúc Bạch',
    imageUrl: 'https://images.unsplash.com/photo-1568731316529-1e36607687295?w=500&h=300&fit=crop',
    author: 'Chef Hoa',
    authorAvatar: 'https://i.pravatar.cc/150?img=17',
    likes: 445,
    comments: 68,
    category: 'salad',
    time: 'Buổi tối',
    description: 'Chè khúc bạch ngọt thanh mát'
  },
  {
    id: 8,
    name: 'Gỏi Ngó Sen Tôm Thịt',
    imageUrl: 'https://images.unsplash.com/photo-1567620905745-e54ca88290dd2?w=500&h=300&fit=crop',
    author: 'Chef Dũng',
    authorAvatar: 'https://i.pravatar.cc/150?img=18',
    likes: 521,
    comments: 73,
    category: 'side',
    time: 'Buổi trưa',
    description: 'Gỏi ngó sen tôm thịt tươi giòn'
  }
];

const ListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { menuItems } = useMenuStore();

  // Filter recipes based on selected category
  const filteredRecipes = selectedCategory === 'all'
    ? mockRecipes
    : mockRecipes.filter(recipe => recipe.category === selectedCategory);

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#f5f5f5', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Left Menu - 20% width */}
      <div style={{
        width: '20%',
        height: '100%',
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        padding: '20px 0',
        overflowY: 'hidden'
      }}>
        <div style={{ padding: '0 16px' }}>
          <Title level={4} style={{ marginBottom: '20px', color: '#FF7A18' }}>
            🍳 CÔNG THỨC NẤU ĂN
          </Title>

          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === 'all' ? '#f0f0f0' : 'transparent',
                borderRadius: '4px',
                marginBottom: '12px'
              }}
              onClick={() => setSelectedCategory('all')}
            >
              Tất cả
            </div>

            {menuItems
              .filter(item => item.key === 'recipes')
              .flatMap(item => item.children || [])
              .map(child => {
                return (
                  <div
                    key={child.key}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: selectedCategory === child.key ? '#f0f0f0' : 'transparent',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={() => setSelectedCategory(child.key)}
                  >
                    {child.icon && <span style={{ marginRight: '8px' }}>{child.icon}</span>}
                    <span>{child.label}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>

      {/* Right Content - 80% width */}
      <div style={{
        width: '80%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        padding: '24px',
        overflowY: 'auto'
      }}>
        <Title level={2} style={{ marginBottom: '24px' }}>
          {selectedCategory === 'all' && 'Tất cả món ăn'}
          {selectedCategory === 'main' && 'Món chính'}
          {selectedCategory === 'side' && 'Món phụ'}
          {selectedCategory === 'drink' && 'Đồ uống'}
        </Title>

        {/* Recipe Cards Grid */}
        <Row gutter={[16, 16]}>
          {filteredRecipes.map(recipe => (
            <Col xs={24} sm={12} md={8} lg={6} key={recipe.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: '250px', overflow: 'hidden' }}>
                    <img
                      alt={recipe.name}
                      src={recipe.imageUrl}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                }
                actions={[
                  <Button type="text" icon={<HeartOutlined />} size="small">
                    {recipe.likes}
                  </Button>,
                  <Button type="text" icon={<MessageOutlined />} size="small">
                    {recipe.comments}
                  </Button>,
                  <Button type="text" icon={<ShareAltOutlined />} size="small">
                  </Button>
                ]}
                style={{
                  marginBottom: '16px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) {
                    img.style.transform = 'scale(1)';
                  }
                }}
              >
                <Card.Meta
                  avatar={<Avatar src={recipe.authorAvatar} />}
                  title={recipe.name}
                  description={
                    <div>
                      <Space>
                        <Badge color="orange" text={recipe.category} />
                        {recipe.time && <Badge color="blue" text={recipe.time} />}
                      </Space>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {recipe.description}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ListPage;