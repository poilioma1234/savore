import React, { useEffect, useState } from "react";
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
  MailOutlined,
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
interface RegisterFormValues {
  usernameOrEmail: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { register, isLoading } = useAuthStore();
  const { message } = App.useApp();
  const [error, setError] = useState<string>("");

  // Check if user is already logged in and redirect to dashboard
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: RegisterFormValues) => {
    setError(""); // Reset error state
    
    if (!values.usernameOrEmail || !values.email || !values.password || !values.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await register(values.usernameOrEmail, values.email, values.password);
      message.success("Xác thực thành công");
      navigate("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as ApiError;
      const errorMessage =
        apiError.response?.data?.error ||
        apiError.response?.data?.message ||
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="usernameOrEmail"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đăng nhập!",
              },
              {
                min: 3,
                message: "Tên đăng nhập phải có ít nhất 3 ký tự",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email!",
              },
              {
                type: "email",
                message: "Vui lòng nhập email hợp lệ!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
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
              {
                min: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
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
