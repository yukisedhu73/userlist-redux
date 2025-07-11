import React, { useEffect, useRef } from 'react';
import { Button, Checkbox, Form, Input, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login as loginThunk } from '../features/auth/authThunk';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);
  const wasSubmitted = useRef(false);

  useEffect(() => {
    if (token && wasSubmitted.current) {
      message.success('Login successful!');
      navigate('/users', { replace: true });
      wasSubmitted.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (error && wasSubmitted.current) {
      message.error(error);
      wasSubmitted.current = false;
    }
  }, [error]);

  const onFinish = (values: any) => {
    wasSubmitted.current = true;
    dispatch(loginThunk({ email: values.email, password: values.password }));
  };

  return (
    <div style={{
      height: '100vh',
      background: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Card style={{ width: 500 }}>
        <Form
          name="login-form"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <Title level={3} style={{ textAlign: 'center' }}>Login</Title>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Enter a valid email!' }
            ]}
          >
            <Input
              placeholder="Email"
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined />}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
