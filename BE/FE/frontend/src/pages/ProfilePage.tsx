import React, { useState, useEffect, useRef } from "react";
import { Typography, Button, Row, Col, Spin, Avatar, Tabs, Tag, Space, Card } from "antd";
import {
  PlayCircleOutlined,
  UserOutlined,
  FireOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  HeartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

// --- Interfaces giữ nguyên như cũ ---
interface Post { id: string; userId: number; linkVideo: string; thumbnail: string; name: string; description: string; tagVideo: string; status: string; createdAt: string; views: number; likes: number; }
interface UserInfo { id: number; fullName: string; email: string; avatar: string; bio: string; createdAt: string; totalPosts: number; }

const mockUserData: UserInfo = {
  id: 1,
  fullName: "Savoré Chef",
  email: "chef@savore.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  bio: "👨‍🍳 Đam mê ẩm thực, yêu thích nấu ăn và chia sẻ những công thức tuyệt vời với cộng đồng. Chuyên về các món Á và Âu. Hãy cùng tôi khám phá hương vị cuộc sống!",
  createdAt: "2023-01-15",
  totalPosts: 24,
};

const generateMockPosts = (userId: number, count: number): Post[] => {
  const tags = ["trứng", "bò", "gà", "cá", "heo"];
  // Tạo random values một lần để không bị thay đổi mỗi lần render
  const getRandomTag = (index: number) => tags[index % tags.length];
  const getRandomViews = (index: number) => Math.floor((index * 37 + 123) % 500) + 10;
  const getRandomLikes = (index: number) => Math.floor((index * 23 + 67) % 100) + 5;
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `post_${userId}_${i}`,
    userId,
    linkVideo: "",
    thumbnail: `https://picsum.photos/seed/${userId}_${i}/600/600`, // Ảnh vuông
    name: `Công thức đặc biệt số ${i + 1}`,
    description: "Mô tả hấp dẫn...",
    tagVideo: getRandomTag(i),
    views: getRandomViews(i), // Thêm số lượt xem
    likes: getRandomLikes(i), // Thêm số lượt thích
    status: "published",
    createdAt: new Date().toISOString(),
  }));
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // --- Logic Fetch Data (Giữ nguyên logic của bạn) ---
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const userData = { ...mockUserData, id: userId ? parseInt(userId) : 1 };
      setUserInfo(userData);
      setUserPosts(generateMockPosts(userData.id, 12));
      setHasMore(userData.totalPosts > 12);
      setLoading(false);
    };
    fetchUserData();
  }, [userId]);

  // --- Render Functions với UI mới ---
  const renderProfileHeader = () => {
    if (!userInfo) return null;
    return (
      <div style={{ padding: '40px 0', borderBottom: '1px solid #efefef', marginBottom: '20px' }}>
        <Row gutter={[32, 32]} align="middle" justify="center">
          <Col xs={24} sm={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', padding: '4px', background: 'linear-gradient(45deg, #FF7A18, #FF0078)', borderRadius: '50%' }}>
              <Avatar
                size={{ xs: 100, sm: 120, md: 150 }}
                src={userInfo.avatar}
                icon={<UserOutlined />}
                style={{ border: '4px solid white' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <Title level={3} style={{ margin: 0, fontWeight: 300 }}>{userInfo.fullName}</Title>
                <Space>
                  <Button type="primary" style={{ background: '#0095f6', borderRadius: '8px', fontWeight: 600 }}>Theo dõi</Button>
                  <Button icon={<SettingOutlined />} type="text" />
                </Space>
              </div>

              <Space size={30}>
                <Text><b style={{ fontSize: '16px' }}>{userInfo.totalPosts}</b> bài viết</Text>
                <Text><b style={{ fontSize: '16px' }}>1.2K</b> người theo dõi</Text>
                <Text><b style={{ fontSize: '16px' }}>342</b> đang theo dõi</Text>
              </Space>

              <div>
                <Text style={{ fontWeight: 600 }}>Chef @ Savoré</Text>
                <Paragraph style={{ color: '#262626', marginTop: 4 }}>{userInfo.bio}</Paragraph>
              </div>
            </Space>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div style={{ maxWidth: "935px", margin: "0 auto", padding: "30px 20px" }}>
        
        {renderProfileHeader()}

        <Tabs 
          centered 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ borderTop: '1px solid #dbdbdb' }}
        >
          <Tabs.TabPane 
            tab={<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', letterSpacing: '1px' }}><AppstoreOutlined /> BÀI VIẾT</span>} 
            key="posts"
          >
            {userPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Title level={4} type="secondary">Chưa có bài viết nào</Title>
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {userPosts.map((video) => (
                  <Col key={video.id} span={8}>
                    <div 
                      className="video-card"
                      style={{ 
                        position: 'relative', 
                        paddingTop: '100%', 
                        cursor: 'pointer',
                        overflow: 'hidden',
                        borderRadius: '4px'
                      }}
                      onClick={() => navigate(`/video/${video.id}`)}
                    >
                      <img
                        alt={video.name}
                        src={video.thumbnail}
                        style={{ 
                          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' 
                        }}
                      />
                      {['trứng', 'bò', 'gà'].includes(video.tagVideo) && (
                         <Tag color="#ff4d4f" style={{ position: 'absolute', top: 10, right: 0, border: 'none', fontWeight: 'bold' }}>
                            <FireOutlined /> HOT
                         </Tag>
                      )}
                      {/* Overlay on Hover */}
                      <div className="video-overlay">
                        <Space style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                          <PlayCircleOutlined /> <span>{video.views}K</span>
                          <HeartOutlined style={{ marginLeft: 10 }} /> <span>{video.likes}</span>
                        </Space>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            {/* Infinite Scroll Target */}
            <div ref={observerTarget} style={{ height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {loading && hasMore && <Spin size="small" />}
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={<span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', letterSpacing: '1px' }}><InfoCircleOutlined /> THÔNG TIN</span>} 
            key="info"
          >
            <Card bordered={false} style={{ borderRadius: '12px', background: 'white' }}>
              <Title level={5}>Giới thiệu</Title>
              <Text type="secondary">ID người dùng: #{userInfo?.id}</Text>
              <br />
              <Text type="secondary">Email: {userInfo?.email}</Text>
              <br />
              <Text type="secondary">Ngày tham gia: {userInfo?.createdAt}</Text>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </div>

      <style>{`
        .video-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .video-card:hover .video-overlay {
          opacity: 1;
        }
        .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        .ant-tabs-ink-bar {
          top: 0 !important;
          height: 1.5px !important;
          background: #262626 !important;
        }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #262626 !important;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;