import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Avatar, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import './VideoPage.css';

// Interface cho bài viết từ API
interface PostDetail {
  id: string;
  userId: number;
  linkVideo: string;
  thumbnail: string;
  name: string;
  description: string;
  tagVideo: string;
  status: string;
  cookingSteps: string;
  createdAt: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  recipeItems: Array<{
    id: string;
    postId: string;
    ingredientId: string;
    quantity: string;
    unit: string;
    ingredient: {
      id: string;
      name: string;
      tag: string;
      providerId: number;
      createdAt: string;
      provider?: {
        id: number;
        email: string;
        fullName: string;
      };
    };
  }>;
}

// Interface cho video liên quan
interface RelatedVideo {
  id: number;
  title: string;
  thumbnail: string;
  chef: {
    name: string;
    avatar: string;
  };
  views: number;
  likes: number;
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Track current video index
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  // Track if video is transitioning (to prevent rapid video switching)
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Track user interaction for swipe hint
  const [hasInteracted, setHasInteracted] = useState(false);
  // Track video element for direct manipulation
  const videoRef = useRef<HTMLIFrameElement>(null);
  
  // State cho dữ liệu video và video liên quan
  const [videoDetail, setVideoDetail] = useState<PostDetail | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tạo dữ liệu video liên quan mẫu
  const generateRelatedVideos = (): RelatedVideo[] => {
    const dishes = [
      "Phở Bò Hà Nội", "Bún Chả Hà Nội", "Bánh Mì Sài Gòn", 
      "Cơm Tấm Sài Gòn", "Bún Bò Huế", "Mì Quảng"
    ];
    
    return Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      title: `Hướng dẫn làm ${dishes[i % dishes.length]}`,
      thumbnail: `https://picsum.photos/seed/related${i}/400/300.jpg`,
      chef: {
        name: `Chef${Math.floor(Math.random() * 100)}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      },
      views: Math.floor(Math.random() * 100000) + 10000,
      likes: Math.floor(Math.random() * 5000) + 500,
    }));
  };

  // Lấy chi tiết video từ API
  useEffect(() => {
    const fetchVideoDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.GET_POST_BY_ID(id || ''));
        if (!response.ok) {
          throw new Error('Failed to fetch video detail');
        }
        const data: PostDetail = await response.json();
        setVideoDetail(data);
        
        // Lấy video liên quan sau khi có dữ liệu video
        setRelatedVideos(generateRelatedVideos());
      } catch (error) {
        console.error('Error fetching video detail:', error);
        message.error('Không thể tải chi tiết video. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [id]);

  // Navigate to previous video
  const goToPreviousVideo = useCallback(() => {
    if (isTransitioning || relatedVideos.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 700);
    
    setCurrentVideoIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? relatedVideos.length - 1 : prevIndex - 1;
      return newIndex;
    });
    
    if (!hasInteracted) setHasInteracted(true);
  }, [isTransitioning, relatedVideos, hasInteracted]);

  // Navigate to next video
  const goToNextVideo = useCallback(() => {
    if (isTransitioning || relatedVideos.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 700);
    
    setCurrentVideoIndex(prevIndex => {
      const newIndex = prevIndex === relatedVideos.length - 1 ? 0 : prevIndex + 1;
      return newIndex;
    });
    
    if (!hasInteracted) setHasInteracted(true);
  }, [isTransitioning, relatedVideos, hasInteracted]);

  // Handle touch events for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY.current - touchEndY;
      
      // Minimum swipe distance to trigger video change
      const minSwipeDistance = 50;
      
      if (Math.abs(swipeDistance) < minSwipeDistance) return;
      
      if (swipeDistance > 0) {
        // Swiped up, go to next video
        goToNextVideo();
      } else {
        // Swiped down, go to previous video
        goToPreviousVideo();
      }
      
      if (!hasInteracted) setHasInteracted(true);
    };

    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNextVideo, goToPreviousVideo, hasInteracted]);

  // Track touch position for swipe detection
  const touchStartY = useRef(0);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          goToPreviousVideo();
          break;
        case 'ArrowDown':
          goToNextVideo();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextVideo, goToPreviousVideo]);

  // Xử lý khi click vào video liên quan
  const viewRelatedVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  // Nếu đang tải, hiển thị loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f7fa'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Nếu không có dữ liệu, hiển thị thông báo lỗi
  if (!videoDetail) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '20px',
        textAlign: 'center'
      }}>
        <Title level={3}>Không tìm thấy video</Title>
        <p>Video bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button type="primary" onClick={() => navigate('/list')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  // Chuyển đổi URL từ YouTube sang embed
  const getEmbedUrl = (youtubeUrl: string) => {
    if (!youtubeUrl) return '';
    
    const videoId = youtubeUrl.includes('youtube.com/watch?v=') 
      ? youtubeUrl.split('watch?v=')[1]?.split('&')[0]
      : youtubeUrl.includes('youtu.be/')
        ? youtubeUrl.split('youtu.be/')[1]?.split('?')[0]
        : '';
        
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : '';
  };

  return (
    <div className="video-page-container" style={{
      height: '100%',
      width: '100vw',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f0f2f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        flex: 'auto',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}>

        {/* SECTION TRÁI: VIDEO (35%) */}
        <div className={`video-section ${isTransitioning ? 'video-transitioning' : ''}`} style={{
          width: '35%',
          height: '100%',
          position: 'relative',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '0',
            paddingBottom: '177.78%' // 16:9 aspect ratio
          }}>
            <iframe
              ref={videoRef}
              src={getEmbedUrl(videoDetail.linkVideo)}
              className={`video-player ${isTransitioning ? 'video-fade' : ''}`}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                border: 'none',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Overlay thông tin trên Video */}
          <div className="video-overlay" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px'
          }}>

          </div>

          {/* Nút điều hướng nổi (Floating Buttons) */}
          <div className={`nav-buttons ${isTransitioning ? 'nav-disabled' : ''}`} style={{
            position: 'absolute',
            right: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            zIndex: 10
          }}>
            {[
              { icon: '▲', dir: -1 },
              { icon: '▼', dir: 1 }
            ].map((btn, i) => (
              <button
                key={i}
                disabled={isTransitioning}
                className="nav-button"
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => setIsTransitioning(false), 800);
                    setCurrentVideoIndex(prevIndex => {
                      const newIndex = btn.dir > 0 
                        ? (prevIndex + 1) % relatedVideos.length
                        : (prevIndex - 1 + relatedVideos.length) % relatedVideos.length;
                      return newIndex;
                    });
                  }
                }}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                {btn.icon}
              </button>
            ))}
          </div>

          {/* Video indicators */}
          <div className="video-indicators" style={{
            position: 'absolute',
            right: '15px',
            bottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10
          }}>
            {relatedVideos.map((_, index) => (
              <div
                key={index}
                className={`video-indicator ${index === currentVideoIndex ? 'active' : ''}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentVideoIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  if (index !== currentVideoIndex && !isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => setIsTransitioning(false), 500);
                    setCurrentVideoIndex(index);
                    if (!hasInteracted) setHasInteracted(true);
                  }
                }}
              />
            ))}
          </div>

          {/* Swipe hint - only show until user interacts */}
          {!hasInteracted && (
            <div className="swipe-hint" style={{
              position: 'absolute',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '14px',
              textAlign: 'center',
              zIndex: 10,
              animation: 'pulse 2s infinite',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              padding: '10px 15px',
              borderRadius: '20px',
              backdropFilter: 'blur(5px)'
            }}>
              ↑ Kéo lên/xuống để chuyển video
            </div>
          )}
        </div>

        {/* SECTION PHẢI: CHI TIẾT (65%) */}
        <div className={`details-section ${isTransitioning ? 'details-transitioning' : ''}`} style={{
          width: '65%',
          height: '100%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <style>{`
            div::-webkit-scrollbar { display: none; }
            @keyframes pulse {
              0% { opacity: 0.8; }
              50% { opacity: 1; }
              100% { opacity: 0.8; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .video-fade {
              animation: fadeIn 0.5s ease-in-out;
            }
          `}</style>

          <div style={{ padding: '32px' }}>
            {/* Header: Chef Info */}
            <div className="chef-info" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '30px',
              borderBottom: '1px solid #f0f0f0',
              paddingBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Avatar size={70} src={`https://i.pravatar.cc/150?img=${videoDetail.user.id}`} icon={<UserOutlined />} style={{ border: '3px solid #FF7A18' }} />
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{videoDetail.user.fullName}</div>
                  <div style={{ color: '#FF7A18', fontWeight: '500' }}>Chuyên gia ẩm thực</div>
                </div>
              </div>
              <button style={{
                padding: '8px 24px',
                borderRadius: '20px',
                backgroundColor: '#FF7A18',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>Theo dõi</button>
            </div>

            {/* Dish Description */}
            <div className="dish-description" style={{ marginBottom: '30px' }}>
              <h1 style={{ fontSize: '32px', color: '#1a1a1a', marginBottom: '10px' }}>{videoDetail.name}</h1>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{videoDetail.description}</p>
            </div>

            {/* Cooking Steps */}
            <div style={{ backgroundColor: '#f0f7ff', padding: '24px', borderRadius: '20px', marginBottom: '30px' }}>
              <h3 style={{ color: '#0056b3', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>📝</span> Các bước thực hiện
              </h3>
              <div style={{ whiteSpace: 'pre-line', fontSize: '16px', color: '#333', lineHeight: '1.5' }}>
                {videoDetail.cookingSteps}
              </div>
            </div>

            {/* Ingredients */}
            <div className="recipe-ingredients" style={{ backgroundColor: '#fff5eb', padding: '24px', borderRadius: '20px', marginBottom: '30px' }}>
              <h3 style={{ color: '#d35400', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px' }}>🥘</span> Nguyên liệu chuẩn bị
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {videoDetail.recipeItems.map((item, i) => (
                  <span key={i} className="ingredient-tag" style={{
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#444',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease'
                  }}>
                    • {item.quantity} {item.unit} {item.ingredient.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Related Videos */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3c72', marginBottom: '20px' }}>
                Video liên quan
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {relatedVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => viewRelatedVideo(video.id.toString())}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e9ecef';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                    }}
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      style={{ 
                        width: '80px', 
                        height: '60px', 
                        objectFit: 'cover', 
                        borderRadius: '6px' 
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{video.title}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {video.chef.name} • {video.views.toLocaleString()} lượt xem
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default VideoPage;