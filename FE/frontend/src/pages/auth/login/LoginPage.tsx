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
import { authService } from "@/services/authService";
import type { LoginRequest } from "@/types/auth";
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
  email: string;
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
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { message } = App.useApp();
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    form.setFieldsValue({ email });
    
    if (email && !validateEmail(email)) {
      setEmailError("Email không đúng định dạng");
    } else {
      setEmailError("");
    }
  };

  const onFinish = async (values: LoginFormValues) => {
    setError(""); // Reset error state
    
    if (!values.email || !values.password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    if (!validateEmail(values.email)) {
      setError("Email không đúng định dạng");
      return;
    }

    try {
      const loginRequest: LoginRequest = {
        email: values.email,
        password: values.password
      };
      
      const authResponse = await authService.login(loginRequest);
      
      // Lưu thông tin authentication vào localStorage
      localStorage.setItem('accessToken', authResponse.accessToken);
      localStorage.setItem('refreshToken', authResponse.refreshToken);
      localStorage.setItem('user', JSON.stringify(authResponse.user));
      
      // Cập nhật state trong store
      login(authResponse.accessToken, {
        ...authResponse.user,
        id: authResponse.user.id.toString(),
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      message.success("Đăng nhập thành công");
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
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Email không đúng định dạng!",
              }
            ]}
            validateStatus={emailError ? "error" : undefined}
            help={emailError}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              onChange={handleEmailChange}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
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
              block
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