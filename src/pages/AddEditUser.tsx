import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import axios from '../api/axios';

const AddEditUser: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && location.state) {
      form.setFieldsValue(location.state);
    }
  }, [form, isEdit, location.state]);

  const onFinish = async (values: any) => {
    const payload = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      avatar: values.avatar,
    };

    try {
      if (isEdit) {
        await axios.put(`/users/${id}`, payload);
        message.success('User updated successfully');
        navigate('/', { state: { updatedUser: { ...payload, id } } });
      } else {
        const res = await axios.post('/users', payload);
        message.success('User created successfully');
        navigate('/', { state: { newUser: { ...payload, id: res.data.id } } });
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  return (
    <Card title={isEdit ? 'Edit User' : 'Create New User'} style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Please enter first name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Please enter last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter email' }]}
        >
          <Input placeholder="Please enter email" />
        </Form.Item>
        <Form.Item
          label="Profile Image Link"
          name="avatar"
          rules={[{ required: true, message: 'Please enter profile image link' }]}
        >
          <Input placeholder="Please enter profile image link" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={() => navigate(-1)} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" htmlType="submit">{isEdit ? 'Update' : 'Submit'}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddEditUser;