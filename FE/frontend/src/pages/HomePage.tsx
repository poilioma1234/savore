import React, { useState, useEffect } from "react";
import { Typography, Button, Row, Col, Card, Avatar, Spin } from "antd";
import {
  PlayCircleOutlined,
  FireOutlined,
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  UserOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

// Interface cho video
interface Video {
  id: number;
  title: string;
  thumbnail: string;
  videoUrl: string;
  embedUrl: string;
  chef: {
    name: string;
    avatar: string;
  };
  recipe: {
    dishName: string;
  };
  views: number;
  likes: number;
  comments: number;
  isHot: boolean;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hotVideos, setHotVideos] = useState<Video[]>([]);
  const [visibleVideos, setVisibleVideos] = useState<number>(8);
  const [loading, setLoading] = useState<boolean>(true);

  // Tạo dữ liệu video mẫu
  const generateSampleVideos = (count: number): Video[] => {
    const dishes = [
      "Phở Bò Hà Nội", "Bún Chả Hà Nội", "Bánh Mì Sài Gòn", 
      "Cơm Tấm Sài Gòn", "Bún Bò Huế", "Mì Quảng", 
      "Bánh Xèo", "Lẩu Thái", "Gỏi Cuốn", "Chả Giò"
    ];
    
    const chefs = [
      "Chef Anh Tuấn", "Chef Minh Anh", "Chef Hồng Nhung", "Chef Quang Huy",
      "Chef Thu Trang", "Đầu bếp Duy Mạnh", "Chef Lan Anh", "Đầu bếp Hoàng Nam"
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const chefIndex = Math.floor(Math.random() * chefs.length);
      const dishIndex = Math.floor(Math.random() * dishes.length);
      const isHot = Math.random() > 0.7; // 30% video hot
      
      return {
        id: i + 1,
        title: `Hướng dẫn làm ${dishes[dishIndex]}`,
        thumbnail: `https://picsum.photos/seed/dish${i}/400/300.jpg`,
        videoUrl: `https://www.facebook.com/reel/171002861637328${i}`,
        embedUrl: `https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F171002861637328${i}%2F&show_text=false&width=476&autoplay=true&muted=true&t=0`,
        chef: {
          name: chefs[chefIndex],
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        },
        recipe: {
          dishName: dishes[dishIndex]
        },
        views: Math.floor(Math.random() * 100000) + 10000,
        likes: Math.floor(Math.random() * 5000) + 500,
        comments: Math.floor(Math.random() * 500) + 50,
        isHot
      };
    });
  };

  // Tải dữ liệu video khi component được mount
  useEffect(() => {
    const timerId = setTimeout(() => {
      setHotVideos(generateSampleVideos(20)); // Tạo 20 video mẫu
      setLoading(false);
    }, 500); // Giả lập độ trễ tải API
    
    return () => clearTimeout(timerId);
  }, []);

  // Xem thêm video
  const loadMoreVideos = () => {
    setVisibleVideos(prev => Math.min(prev + 4, hotVideos.length));
  };

  // Điều hướng đến trang chi tiết video
  const viewVideo = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  // Render badge "Hot" cho video nổi bật
  const renderHotBadge = (isHot: boolean) => {
    if (!isHot) return null;
    
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'linear-gradient(135deg, #FF4757 0%, #FF6348 100%)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        zIndex: 2
      }}>
        <FireOutlined /> HOT
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Banner Quảng Cáo */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '400px',
          background: 'linear-gradient(135deg, #FF7A18 0%, #FF9558 50%, #FFB176 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url("https://picsum.photos/seed/banner/1920/400.jpg") center/cover',
            opacity: 0.4
          }} />
          
          <div style={{ 
            position: 'relative', 
            zIndex: 1, 
            textAlign: 'center',
            maxWidth: '800px',
            padding: '0 24px'
          }}>
            <Title style={{
              color: "white",
              fontSize: "56px",
              fontWeight: 800,
              marginBottom: "16px",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}>
              Savore - Khám Phá Hành Trình Ẩm Thực
            </Title>
            
            <Paragraph style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "32px",
              lineHeight: 1.6,
            }}>
              Tham gia cùng hàng ngàn đầu bếp chuyên nghiệp để học hỏi những công thức nấu ăn tuyệt vời nhất
            </Paragraph>
            
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/video")}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(82, 196, 26, 0.25)",
              }}
            >
              Khám phá ngay <PlayCircleOutlined style={{ marginLeft: "8px" }} />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Video Hot */}
      <div style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Title level={2} style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1e3c72",
              marginBottom: "12px",
            }}>
              Video Nổi Bật <FireOutlined style={{ color: "#FF4757" }} />
            </Title>
            
            <Paragraph style={{
              fontSize: "16px",
              color: "#666",
            }}>
              Khám phá những công thức nấu ăn đang được yêu thích nhất
            </Paragraph>
          </div>

          {/* Loading State */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <p style={{ marginTop: '16px', color: '#666' }}>Đang tải video...</p>
            </div>
          ) : (
            <>
              {/* Video Grid */}
              <Row gutter={[24, 24]}>
                {hotVideos.slice(0, visibleVideos).map((video) => (
                  <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          {renderHotBadge(video.isHot)}
                          <img
                            alt={video.title}
                            src={video.thumbnail}
                            style={{ 
                              width: '100%', 
                              height: '180px',
                              objectFit: 'cover',
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px'
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              right: '8px',
                              background: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          >
                            <EyeOutlined style={{ marginRight: '4px' }} />
                            {video.views.toLocaleString()}
                          </div>
                        </div>
                      }
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        height: '100%',
                      }}
                      bodyStyle={{ padding: '12px' }}
                      actions={[
                        <span key="likes"><HeartOutlined /> {video.likes.toLocaleString()}</span>,
                        <span key="comments"><CommentOutlined /> {video.comments.toLocaleString()}</span>,
                        <span key="share"><ShareAltOutlined /> Chia sẻ</span>
                      ]}
                    >
                      <Card.Meta
                        avatar={<Avatar src={video.chef.avatar} icon={<UserOutlined />} />}
                        title={
                          <div style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            fontSize: '14px'
                          }}>
                            {video.title}
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                              {video.chef.name}
                            </div>
                            <Button 
                              type="primary" 
                              size="small" 
                              icon={<PlayCircleOutlined />}
                              onClick={() => viewVideo(video.id)}
                              style={{
                                background: 'linear-gradient(135deg, #FF7A18 0%, #FF9558 100%)',
                                border: 'none',
                                width: '100%'
                              }}
                            >
                              Xem ngay
                            </Button>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Nút Xem Thêm */}
              {visibleVideos < hotVideos.length && (
                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Button
                    type="default"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={loadMoreVideos}
                    style={{
                      height: "48px",
                      padding: "0 24px",
                      borderRadius: "8px",
                      border: "1px solid #FF7A18",
                      color: "#FF7A18",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    Xem thêm video
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;