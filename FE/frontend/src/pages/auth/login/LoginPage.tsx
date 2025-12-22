import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  App,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { 
  containerStyle, 
  cardStyle, 
  titleStyle, 
  buttonStyle, 
  errorStyle, 
  linkStyle 
} from "@/styles/authStyles";

const { Title } = Typography;

// Form value interfaces
interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
  remember: boolean;
}

// Error interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login, isLoading } = useAuthStore();
  const { message } = App.useApp();
  const [error, setError] = useState<string>("");

  // Check if user is already logged in and redirect to dashboard
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: LoginFormValues) => {
    setError(""); // Reset error state
    
    if (!values.usernameOrEmail || !values.password) {
      setError("Vui lòng nhập tên đăng nhập/email và mật khẩu");
      return;
    }

    try {
      await login(values.usernameOrEmail, values.password, values.remember);
      message.success("Xác thực thành công");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
        "Đăng nhập thất bại";
      setError(errorMessage);
    }
  };

  const adjustedErrorStyle: React.CSSProperties = {
    ...errorStyle,
    textAlign: "left",
    marginLeft: "10px",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <Title style={titleStyle} level={2}>
          Chúc ngon miệng Savoré
        </Title>
        
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đăng nhập hoặc email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập hoặc email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={buttonStyle}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          {error && <div style={adjustedErrorStyle}>{error}</div>}

          <div style={linkStyle}>
            <Button
              type="link"
              onClick={() => navigate("/register")}
              style={{ padding: "0" }}
            >
              Chưa có tài khoản? Đăng ký ngay
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
