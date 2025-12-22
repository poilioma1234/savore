import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './VideoPage.css';

const VideoPage: React.FC = () => {
  const [videos, setVideos] = useState<Array<{
    author: ReactNode;
    id: number;
    title: string;
    url: string;
    embedUrl: string;
    rating: number;
    likes: number;
    comments: number;
    user: {
      name: string;
      avatar: string;
    };
    recipe: {
      dishName: string;
      ingredients: string[];
      steps: string[];
      description: string;
    };
  }>>([]);

  // Track current video index
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  // Track if video is transitioning (to prevent rapid video switching)
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Track user interaction for swipe hint
  const [hasInteracted, setHasInteracted] = useState(false);
  // Track touch position for swipe detection
  const touchStartY = useRef(0);
  // Track video element for direct manipulation
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Function to generate random rating and round down to nearest 0.5
  const generateRating = () => {
    const randomRating = Math.random() * 4.5 + 0.5; // Random between 0.5 and 5
    return Math.floor(randomRating * 2) / 2; // Round down to nearest 0.5
  };

  // Function to generate random recipe description
  const generateRecipeDescription = () => {
    const dishes = [
      "Phở Bò", "Bún Chả", "Bánh Mì", "Gỏi Cuốn", "Cơm Tấm",
      "Chả Giò", "Bún Bò Huế", "Mì Quảng", "Bánh Xèo", "Lẩu Thái"
    ];
    const ingredients = [
      "thịt bò", "thịt heo", "tôm", "gia cầm", "rau thơm",
      "nấm", "đậu phụ", "bún", "bánh tráng", "gia vị"
    ];
    const steps = [
      "Sơ chế nguyên liệu", "Ướp thịt với gia vị", "Chiên vàng",
      "Luộc rau", "Trộn đều", "Thưởng thức nóng"
    ];

    const dish = dishes[Math.floor(Math.random() * dishes.length)];
    const selectedIngredients = [...new Set(Array.from({ length: 5 }, () =>
      ingredients[Math.floor(Math.random() * ingredients.length)]))];

    return {
      dishName: dish,
      ingredients: selectedIngredients,
      steps: steps,
      description: `Món ${dish} được chế biến từ những nguyên liệu tươi ngon nhất. 
                  Đây là món ăn truyền thống của Việt Nam, mang hương vị đặc trưng 
                  không thể lẫn vào đâu được.`
    };
  };

  // Initialize videos with random values on component mount
  useEffect(() => {
    const initializeVideos = () => {
      const sampleVideos = [
        {
          id: 1,
          title: "Facebook Reel 1",
          url: "https://www.facebook.com/reel/1710028616373284",
          embedUrl: "https://www.facebook.com/plugins/video.php?height=480&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1710028616373284%2F&show_text=false&width=480&autoplay=true&muted=true&t=0"
        },
        {
          id: 2,
          title: "Facebook Reel 2",
          url: "https://www.facebook.com/reel/1653526609143153",
          embedUrl: "https://www.facebook.com/plugins/video.php?height=480&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1653526609143153%2F&show_text=false&width=480&autoplay=true&muted=true&t=0"
        },
        {
          id: 3,
          title: "Facebook Reel 4",
          url: "https://www.facebook.com/reel/839523895516280",
          embedUrl: "https://www.facebook.com/plugins/video.php?height=480&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F839523895516280%2F&show_text=false&width=480&autoplay=true&muted=true&t=0"
        }
      ];

      // Add random values
      const videosWithRandomValues = sampleVideos.map(video => ({
        ...video,
        author: `Chef${Math.floor(Math.random() * 100)}`,
        rating: generateRating(),
        likes: Math.floor(Math.random() * 10000) + 100,
        comments: Math.floor(Math.random() * 500) + 10,
        user: {
          name: `Chef${Math.floor(Math.random() * 100)}`,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        },
        recipe: generateRecipeDescription()
      }));

      return videosWithRandomValues;
    };

    const timerId = setTimeout(() => {
      setVideos(initializeVideos());
    }, 0);

    return () => clearTimeout(timerId);
  }, []);


  // Navigate to previous video
  const goToPreviousVideo = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    // Increased timeout to allow description animation to complete
    setTimeout(() => setIsTransitioning(false), 700);
    
    setCurrentVideoIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? videos.length - 1 : prevIndex - 1; // Loop to last video
      
      
      return newIndex;
    });
    
    if (!hasInteracted) setHasInteracted(true);
  }, [isTransitioning, videos, hasInteracted]);

  // Navigate to next video
  const goToNextVideo = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    // Increased timeout to allow description animation to complete
    setTimeout(() => setIsTransitioning(false), 700);
    
    setCurrentVideoIndex(prevIndex => {
      const newIndex = prevIndex === videos.length - 1 ? 0 : prevIndex + 1; // Loop to first video
      
      
      return newIndex;
    });
    
    if (!hasInteracted) setHasInteracted(true);
  }, [isTransitioning, videos, hasInteracted]);


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


  // Force video to restart when index changes
  useEffect(() => {
    if (videoRef.current && videos[currentVideoIndex]) {
      // Add a unique timestamp to force video reload and autoplay
      const currentSrc = videoRef.current.src;
      const baseUrl = currentSrc.split('?')[0];
      const timestamp = Date.now();
      videoRef.current.src = `${baseUrl}?autoplay=1&muted=1&t=${timestamp}`;
    }
  }, [currentVideoIndex, videos]);

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
      {videos.length > 0 && (
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
            overflow: 'hidden' // Added to prevent overflow
          }}>
            <div style={{
              width: '100%',
              height: '0',
              paddingBottom: '177.78%' // 16:9 aspect ratio (9/16 = 0.5625 or 56.25%)
            }}>
              <iframe
                ref={videoRef}
                src={videos[currentVideoIndex].embedUrl}
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
                  objectFit: 'contain', // Changed from cover to contain
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
                { icon: '▲', dir: -1, disabled: currentVideoIndex === 0 },
                { icon: '▼', dir: 1, disabled: currentVideoIndex === videos.length - 1 }
              ].map((btn, i) => (
                <button
                  key={i}
                  disabled={btn.disabled || isTransitioning}
                  className="nav-button"
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setTimeout(() => setIsTransitioning(false), 800);
                      setCurrentVideoIndex(prevIndex => {
                        const newIndex = prevIndex + btn.dir;
                        
                        
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
                    cursor: btn.disabled ? 'not-allowed' : 'pointer',
                    opacity: btn.disabled ? 0.3 : 1,
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
              {videos.map((_, index) => (
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
                  <Avatar size={70} src={videos[currentVideoIndex].user.avatar} icon={<UserOutlined />} style={{ border: '3px solid #FF7A18' }} />
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a' }}>{videos[currentVideoIndex].user.name}</div>
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
                <h1 style={{ fontSize: '32px', color: '#1a1a1a', marginBottom: '10px' }}>{videos[currentVideoIndex].recipe.dishName}</h1>
                <p style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>{videos[currentVideoIndex].recipe.description}</p>
              </div>

              {/* Stats Bar */}
              <div className="stats-bar" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                marginBottom: '35px'
              }}>
                {[
                  { label: 'Đánh giá', val: `${videos[currentVideoIndex].rating} ⭐`, color: '#FFD700' },
                  { label: 'Yêu thích', val: videos[currentVideoIndex].likes.toLocaleString(), color: '#FF4757' },
                  { label: 'Bình luận', val: videos[currentVideoIndex].comments.toLocaleString(), color: '#3742FA' },
                  { label: 'Chia sẻ', val: 'Share', color: '#2ed573' }
                ].map((stat, i) => (
                  <div key={i} className="stat-card" style={{
                    textAlign: 'center',
                    padding: '15px 10px',
                    borderRadius: '16px',
                    background: '#f8f9fa',
                    border: '1px solid #eee',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: stat.color }}>{stat.val}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px', textTransform: 'uppercase' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recipe Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {/* Ingredients */}
                <div className="recipe-ingredients" style={{ backgroundColor: '#fff5eb', padding: '24px', borderRadius: '20px' }}>
                  <h3 style={{ color: '#d35400', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px' }}>🥘</span> Nguyên liệu chuẩn bị
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {videos[currentVideoIndex].recipe.ingredients.map((ing, i) => (
                      <span key={i} className="ingredient-tag" style={{
                        backgroundColor: 'white',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#444',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s ease'
                      }}>
                        • {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="recipe-steps" style={{ backgroundColor: '#f0f7ff', padding: '24px', borderRadius: '20px' }}>
                  <h3 style={{ color: '#0056b3', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px' }}>📝</span> Các bước thực hiện
                  </h3>
                  {videos[currentVideoIndex].recipe.steps.map((step, i) => (
                    <div key={i} className="step-item" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                      <div className="step-number" style={{
                        minWidth: '28px',
                        height: '28px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginTop: '2px',
                        transition: 'all 0.3s ease'
                      }}>{i + 1}</div>
                      <div style={{ fontSize: '16px', color: '#333', lineHeight: '1.5' }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="footer-note" style={{
                marginTop: '40px',
                padding: '30px',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FF7A18 0%, #FF9F53 100%)',
                borderRadius: '20px',
                color: 'white',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>👨‍🍳</div>
                <h3 style={{ margin: 0 }}>Chúc bạn ngon miệng!</h3>
                <p style={{ opacity: 0.9, fontSize: '14px' }}>Đừng quên chia sẻ thành quả của bạn với cộng đồng nhé.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default VideoPage;