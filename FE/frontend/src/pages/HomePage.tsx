import React, { useState, useEffect, useRef } from "react";
import { Typography, Button, Row, Col, Card, Spin, message } from "antd";
import {
  PlayCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';

const { Title, Paragraph } = Typography;

// Interface cho video từ API
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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [hotVideos, setHotVideos] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 12; // Mỗi trang 12 video
  
  // Dùng để theo dõi element cuối cùng để trigger infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  // Gọi API lấy danh sách bài viết
  useEffect(() => {
    fetchPosts(1);
  }, []);

  // Cài đặt Infinite Scroll với Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const timer = setTimeout(() => {
            fetchPosts(page + 1, true);
          }, 1000); // Chờ 1 giây trước khi tải thêm

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 } // Trigger khi 10% của element xuất hiện
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loadingMore, loading, page]);

  // Hàm fetch posts với phân trang
  const fetchPosts = async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_ENDPOINTS.GET_POSTS}?page=${pageNum}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data: ApiResponse = await response.json();
      
      if (isLoadMore) {
        setHotVideos(prev => [...prev, ...data.data]);
      } else {
        setHotVideos(data.data);
      }
      
      setTotalCount(data.meta.total);
      setHasMore(pageNum < data.meta.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
      message.error('Không thể tải danh sách video. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Điều hướng đến trang chi tiết video
  const viewVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  // Render badge "Hot" cho video nổi bật
  const renderHotBadge = (tagVideo: string) => {
    const hotTags = ['trứng', 'bò', 'gà'];
    if (!hotTags.includes(tagVideo)) return null;
    
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
              onClick={() => navigate("/list")}
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
                {hotVideos.map((video) => (
                  <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative' }}>
                          {renderHotBadge(video.tagVideo)}
                          <img
                            alt={video.name}
                            src={video.thumbnail}
                            style={{ 
                              width: '100%', 
                              height: '180px',
                              objectFit: 'cover',
                              borderTopLeftRadius: '8px',
                              borderTopRightRadius: '8px'
                            }}
                          />
                        </div>
                      }
                      style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                      bodyStyle={{ padding: '12px' }}
                      onClick={() => viewVideo(video.id)}
                    >
                      <Card.Meta
                        title={
                          <div style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {video.name}
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                              {video.user.fullName}
                            </div>
                            <Button 
                              type="primary" 
                              size="small" 
                              icon={<PlayCircleOutlined />}
                              onClick={(e) => {
                                e.stopPropagation();
                                viewVideo(video.id);
                              }}
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
              
              {/* Loading More Spinner */}
              {loadingMore && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin size="large" />
                  <p style={{ marginTop: '16px', color: '#666' }}>Đang tải thêm video...</p>
                </div>
              )}
              
              {/* Intersection Observer Target */}
              <div ref={observerTarget} style={{ height: '20px' }}></div>
              
              {/* Load More Button (Fallback) */}
              {!hasMore && hotVideos.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <p style={{ color: '#666' }}>
                    Đã tải hết {totalCount} video
                  </p>
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