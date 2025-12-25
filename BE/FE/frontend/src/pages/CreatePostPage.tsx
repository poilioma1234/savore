import React, { useState } from "react";
import { Form, Input, Button, Select, Upload, message, Typography, Spin, Row, Col } from "antd";
import { UploadOutlined, PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '../config/api';
import '../styles/authStyles';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Interface cho form data
interface PostFormData {
  name: string;
  description: string;
  linkVideo: string;
  tagVideo: string;
}

const CreatePostPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  // Các tag phổ biến cho video công thức
  const videoTags = [
    "trứng", "bò", "gà", "cá", "heo", "rau củ", "tráng miệng", 
    "đồ uống", "món chính", "món phụ", "súp", "salad", "nướng", "hấp",
    "chiên", "xào", "luộc", "kho", "rim", "tẩm ướp", "đông lạnh"
  ];

  // Xử lý upload thumbnail
  const handleThumbnailChange = (info: any) => {
    if (info.file.status === 'done') {
      setThumbnail(info.file.response?.url || '');
      message.success('Tải lên hình ảnh thành công');
    } else if (info.file.status === 'error') {
      message.error('Tải lên hình ảnh thất bại');
    }
  };

  // Hàm định dạng URL video (YouTube, TikTok)
  const formatVideoUrl = (url: string): string => {
    if (!url) return '';
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // TikTok
    const tiktokRegex = /(?:tiktok\.com\/@[^/]+\/video\/)(\d+)/;
    const tiktokMatch = url.match(tiktokRegex);
    if (tiktokMatch) {
      return url; // TikTok không có embed URL chuẩn
    }
    
    return url;
  };

  // Xử lý submit form
  const handleSubmit = async (values: PostFormData) => {
    setLoading(true);
    
    try {
      // Kiểm tra thumbnail
      if (!thumbnail) {
        message.error('Vui lòng tải lên hình ảnh thumbnail');
        setLoading(false);
        return;
      }

      // Định dạng lại link video
      const formattedVideoUrl = formatVideoUrl(values.linkVideo);
      
      // Tạo payload cho API
      const payload = {
        name: values.name,
        description: values.description,
        linkVideo: formattedVideoUrl,
        tagVideo: values.tagVideo,
        thumbnail: thumbnail,
        status: "published" // Mặc định là published khi tạo mới
      };

      // Gọi API để tạo bài viết mới
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.CREATE_POST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo bài viết mới');
      }

      const data = await response.json();
      message.success('Tạo bài viết thành công!');
      
      // Chuyển hướng đến trang chi tiết bài viết vừa tạo
      navigate(`/video/${data.id}`);
    } catch (error: any) {
      console.error('Error creating post:', error);
      message.error(error.message || 'Không thể tạo bài viết mới. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "20px 0"
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/")}
            style={{ marginBottom: "20px" }}
          >
            Quay lại trang chủ
          </Button>
          
          <Title level={2} style={{ textAlign: "center", color: "#1e3c72" }}>
            Tạo Bài Viết Công Thức Mới
          </Title>
          
          <Paragraph style={{ textAlign: "center", color: "#666" }}>
            Chia sẻ công thức nấu ăn tuyệt vời của bạn với cộng đồng Savore
          </Paragraph>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            padding: "30px"
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: "published"
            }}
          >
            <Form.Item
              name="name"
              label="Tên Công Thức"
              rules={[{ required: true, message: "Vui lòng nhập tên công thức!" }]}
            >
              <Input placeholder="Nhập tên công thức" size="large" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Mô tả công thức, nguyên liệu, và các bước thực hiện..." 
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="linkVideo"
                  label="Link Video"
                  rules={[{ required: true, message: "Vui lòng nhập link video!" }]}
                >
                  <Input 
                    placeholder="Link YouTube hoặc TikTok" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="tagVideo"
                  label="Thẻ Tag"
                  rules={[{ required: true, message: "Vui lòng chọn tag!" }]}
                >
                  <Select placeholder="Chọn tag cho video" size="large">
                    {videoTags.map(tag => (
                      <Option key={tag} value={tag}>{tag}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Thumbnail">
              <Upload
                name="thumbnail"
                listType="picture-card"
                className="thumbnail-uploader"
                showUploadList={false}
                action="/api/upload" // Cần thay đổi endpoint upload thực tế
                onChange={handleThumbnailChange}
              >
                {thumbnail ? (
                  <img src={thumbnail} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #FF7A18 0%, #FF9558 100%)",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600"
                }}
              >
                {loading ? <Spin size="small" /> : "Đăng Bài Viết"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
