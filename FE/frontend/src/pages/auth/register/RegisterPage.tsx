import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  App,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/authService";
import type { RegisterRequest } from "@/types/auth";
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
interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  terms: boolean;
}

// Error interface
interface ErrorResponse {
  message?: string;
  error?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const { message } = App.useApp();
  const [error, setError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

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

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    form.setFieldsValue({ password });
    
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự");
    } else {
      setPasswordError("");
    }
  };

  const onFinish = async (values: RegisterFormValues) => {
    setError(""); // Reset error state
    
    if (!values.email || !values.password || !values.confirmPassword || !values.fullName) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!validateEmail(values.email)) {
      setError("Email không đúng định dạng");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const registerRequest: RegisterRequest = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: "USER" // Mặc định role là USER
      };
      
      const authResponse = await authService.register(registerRequest);
      
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
      
      message.success("Đăng ký thành công");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as { response?: { data?: ErrorResponse } };
      const errorMessage =
        apiError.response?.data?.error ||
        "Đăng ký thất bại";
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
          name="register"
          initialValues={{ terms: false }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập họ và tên!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
            />
          </Form.Item>

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
              },
            ]}
            validateStatus={emailError ? "error" : undefined}
            help={emailError}
          >
            <Input
              prefix={<MailOutlined />}
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
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự!",
              },
            ]}
            validateStatus={passwordError ? "error" : undefined}
            help={passwordError}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              onChange={handlePasswordChange}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Hai mật khẩu không khớp nhau!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={buttonStyle}
              block
            >
              Đăng ký
            </Button>
          </Form.Item>

          {error && <div style={adjustedErrorStyle}>{error}</div>}

          <div style={linkStyle}>
            <Button
              type="link"
              onClick={() => navigate("/login")}
              style={{ padding: "0" }}
            >
              Đã có tài khoản? Đăng nhập
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;