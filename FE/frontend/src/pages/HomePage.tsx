import React from "react";
import { Typography, Button, Row, Col, Card, Space } from "antd";
import {
  DatabaseOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DatabaseOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Quản lý Tồn kho",
      description: "Theo dõi và quản lý tồn kho theo thời gian thực trên nhiều nhà kho.",
    },
    {
      icon: <BarChartOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Phân tích Nâng cao",
      description: "Nhận thông tin chi tiết về hoạt động kho của bạn với báo cáo và phân tích chi tiết.",
    },
    {
      icon: <TeamOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Hợp tác Đội ngũ",
      description: "Phối hợp với đội ngũ của bạn một cách hiệu quả với quyền truy cập dựa trên vai trò.",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Bảo mật Doanh nghiệp",
      description: "Dữ liệu của bạn được bảo vệ với bảo mật và tuân thủ cấp doanh nghiệp.",
    },
    {
      icon: <EnvironmentOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Hỗ trợ Nhiều Địa điểm",
      description: "Quản lý nhiều nhà kho và cơ sở từ một bảng điều khiển duy nhất.",
    },
    {
      icon: <SettingOutlined style={{ fontSize: "36px", color: "#667eea" }} />,
      title: "Tùy chỉnh",
      description: "Tùy chỉnh hệ thống để phù hợp với quy trình và luồng công việc kinh doanh của bạn.",
    },
  ];

  const benefits = [
    "Theo dõi tồn kho theo thời gian thực",
    "Quản lý đa cơ sở",
    "Giao diện thân thiện với thiết bị di động",
    "Báo cáo nâng cao",
    "API RESTful cho tích hợp",
    "Hỗ trợ khách hàng 24/7",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 20px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            animation: "float 25s ease-in-out infinite",
            opacity: 0.4,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "15%",
            width: "300px",
            height: "300px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            borderRadius: "50%",
            animation: "pulse 6s ease-in-out infinite",
            backdropFilter: "blur(10px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            width: "200px",
            height: "200px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
            borderRadius: "50%",
            animation: "float 8s ease-in-out infinite reverse",
            backdropFilter: "blur(8px)",
          }}
        />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "800px" }}>
          <Title
            style={{
              color: "white",
              fontSize: "56px",
              fontWeight: 800,
              marginBottom: "24px",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Hệ thống Quản lý Kho SaaS
          </Title>

          <Paragraph
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "40px",
              lineHeight: 1.6,
              maxWidth: "600px",
            }}
          >
            Tối ưu hóa hoạt động kho của bạn với giải pháp quản lý toàn diện được thiết kế cho doanh nghiệp mọi kích thước.
          </Paragraph>

          <Space size="large">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/register")}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "8px",
                background:
                  "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(82, 196, 26, 0.25)",
              }}
            >
              Bắt đầu{" "}
              <ArrowRightOutlined style={{ marginLeft: "8px" }} />
            </Button>

            <Button
              size="large"
              onClick={() => navigate("/login")}
              style={{
                height: "48px",
                padding: "0 32px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                fontSize: "16px",
                fontWeight: 600,
                backdropFilter: "blur(5px)",
              }}
            >
              Đăng nhập
            </Button>
          </Space>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          padding: "80px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "#1e3c72",
              marginBottom: "16px",
            }}
          >
            Tính năng Nổi bật
          </Title>

          <Paragraph
            style={{
              fontSize: "18px",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Hệ thống quản lý kho của chúng tôi cung cấp mọi thứ bạn cần để quản lý hoạt động một cách hiệu quả.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  textAlign: "center",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{
                  padding: "40px 24px",
                }}
              >
                <div style={{ marginBottom: "24px" }}>{feature.icon}</div>
                <Title level={4} style={{ marginBottom: "12px" }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: "#666", lineHeight: 1.6 }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Benefits Section */}
      <div
        style={{
          padding: "80px 20px",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <Title
                level={2}
                style={{
                  fontSize: "40px",
                  fontWeight: 700,
                  color: "#1e3c72",
                  marginBottom: "24px",
                }}
              >
                Tại sao chọn SaaS WMS?
              </Title>

              <Paragraph
                style={{
                  fontSize: "18px",
                  color: "#666",
                  marginBottom: "40px",
                  lineHeight: 1.6,
                }}
              >
                Hệ thống quản lý kho của chúng tôi được thiết kế để giúp doanh nghiệp mọi kích thước tối ưu hóa hoạt động và tăng hiệu quả.
              </Paragraph>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "18px", marginRight: "12px" }} />
                    <Text style={{ fontSize: "16px" }}>{benefit}</Text>
                  </div>
                ))}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div
                style={{
                  height: "400px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background:
                      "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                    animation: "float 25s ease-in-out infinite",
                    opacity: 0.4,
                  }}
                />

                <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "20px" }}>
                  <Title
                    level={3}
                    style={{
                      color: "white",
                      marginBottom: "24px",
                      fontWeight: 700,
                    }}
                  >
                    Sẵn sàng để Bắt đầu?
                  </Title>

                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "rgba(255,255,255,0.9)",
                      marginBottom: "32px",
                      lineHeight: 1.6,
                    }}
                  >
                    Tham gia hàng nghìn doanh nghiệp đang sử dụng SaaS WMS để hợp lý hóa hoạt động của họ.
                  </Paragraph>

                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/register")}
                    style={{
                      height: "48px",
                      padding: "0 32px",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      boxShadow: "0 4px 12px rgba(82, 196, 26, 0.25)",
                    }}
                  >
                    Bắt đầu Dùng thử Miễn phí
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
