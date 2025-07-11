// src/pages/Login.tsx
import React, { useEffect } from 'react';
import { Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { login as loginThunk } from '../features/auth/authThunk';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      message.success('Login successful!');
      navigate('/users', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const onFinish = (values: any) => {
    dispatch(loginThunk({ email: values.email, password: values.password }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Form
        name="login-form"
        onFinish={onFinish}
        initialValues={{ remember: true }}
        style={{ width: 300 }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
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
    </div>
  );
};

export default Login;
