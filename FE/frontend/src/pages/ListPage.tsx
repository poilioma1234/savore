import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Space, Row, Col, Badge, Spin, message, Input, Select } from 'antd';
import {
  HeartOutlined,
  ShareAltOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const { Title, Text } = Typography;
const { Option } = Select;

// Interface cho bài viết từ API
interface Post {
  id: string;
  userId: number;
  linkVideo: string;
  thumbnail: string;
  name: string;
  description: string;
  tagVideo: string;
  status: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  recipeItems?: Array<{
    id: string;
    postId: string;
    ingredientId: string;
    quantity: string;
    unit: string;
  }>;
}

interface ApiResponse {
  data: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ListPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Các thẻ tag có sẵn
  const tags = ['all', 'trứng', 'bò', 'gà', 'rau', 'gia vị'];

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.GET_POSTS);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data: ApiResponse = await response.json();
        setPosts(data.data);
        setFilteredPosts(data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        message.error('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Lọc bài viết theo tìm kiếm và tag
  useEffect(() => {
    let filtered = posts;

    // Lọc theo tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => post.tagVideo === selectedTag);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedTag]);

  // Điều hướng đến trang chi tiết
  const viewVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  // Xem video từ link YouTube
  const watchVideo = (linkVideo: string) => {
    window.open(linkVideo, '_blank');
  };

  // Render danh sách tag
  const renderTagOptions = () => {
    return tags.map(tag => (
      <Option key={tag} value={tag}>
        {tag === 'all' ? 'Tất cả' : tag.charAt(0).toUpperCase() + tag.slice(1)}
      </Option>
    ));
  };

  // Lấy màu cho tag
  const getTagColor = (tag: string) => {
    const colorMap: { [key: string]: string } = {
      'trứng': '#f9d423',
      'bò': '#ff6b6b',
      'gà': '#ff9f43',
      'rau': '#26de81',
      'gia vị': '#45aaf2'
    };
    return colorMap[tag] || '#718093';
  };

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: '#f5f5f5', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Left Menu - 20% width */}
      <div style={{
        width: '20%',
        height: '100%',
        backgroundColor: 'white',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        padding: '20px 0',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 16px' }}>
          <Title level={4} style={{ marginBottom: '20px', color: '#FF7A18' }}>
            🍳 CÔNG THỨC NẤU ĂN
          </Title>

          <div style={{ marginBottom: '30px' }}>
            <div style={{ marginBottom: '12px' }}>
              <Text strong>Tìm kiếm:</Text>
              <Input
                placeholder="Nhập tên món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <Text strong>Loại món ăn:</Text>
              <Select
                value={selectedTag}
                onChange={setSelectedTag}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {renderTagOptions()}
              </Select>
            </div>
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
          {selectedTag === 'all' ? 'Tất cả món ăn' : `Món ${selectedTag}`}
        </Title>

        {/* Loading State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <p style={{ marginTop: '16px', color: '#666' }}>Đang tải danh sách...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          /* Recipe Cards Grid */
          <Row gutter={[16, 16]}>
            {filteredPosts.map(post => (
              <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: '250px', overflow: 'hidden' }}>
                      <img
                        alt={post.name}
                        src={post.thumbnail}
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
                      {/* Có thể thêm số likes từ API sau */}
                    </Button>,
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />} 
                      size="small"
                      onClick={() => watchVideo(post.linkVideo)}
                    >
                      Xem
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
                  onClick={() => viewVideo(post.id)}
                >
                  <Card.Meta
                    avatar={<Avatar src={`https://i.pravatar.cc/150?img=${post.user.id}`} />}
                    title={
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {post.name}
                      </div>
                    }
                    description={
                      <div>
                        <Space wrap>
                          <Badge 
                            color={getTagColor(post.tagVideo)} 
                            text={post.tagVideo} 
                          />
                        </Space>
                        <br />
                        <Text 
                          type="secondary" 
                          style={{ 
                            fontSize: '12px',
                            display: 'block',
                            marginTop: '4px'
                          }}
                        >
                          {post.description.length > 60 
                            ? `${post.description.substring(0, 60)}...` 
                            : post.description}
                        </Text>
                        <br />
                        <Text 
                          style={{ 
                            fontSize: '12px',
                            display: 'block',
                            marginTop: '4px'
                          }}
                        >
                          <Avatar size="small" src={`https://i.pravatar.cc/150?img=${post.user.id}`} />
                          <span style={{ marginLeft: '4px' }}>{post.user.fullName}</span>
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Title level={4}>Không tìm thấy món ăn</Title>
            <Text>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</Text>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage;