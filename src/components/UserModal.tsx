import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import axios from '../api/axios';

export interface User {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (user: User, isEdit: boolean) => void;
  initialValues?: Partial<User> | null;
}

const UserModal: React.FC<Props> = ({ open, onClose, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const isEdit = !!initialValues?.id;

  // Reset form correctly whenever modal opens or changes mode
  useEffect(() => {
    if (open) {
      if (isEdit && initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields(); // clear old data
      }
    }
  }, [open, isEdit, initialValues, form]);

  const handleFinish = async (values: any) => {
    const payload = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      avatar: values.avatar,
    };

    try {
      if (isEdit) {
        await axios.put(`/users/${initialValues?.id}`, payload);
        onSuccess({ ...payload, id: initialValues?.id! }, true);
      } else {
        const res = await axios.post('/users', payload);
        const id = res.data.id || Math.floor(Math.random() * 100000);
        onSuccess({ ...payload, id }, false);
      }
      form.resetFields(); // 🔁 reset after success to ensure form is clear next open
    } catch (err) {
      console.error('User save failed', err);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit User' : 'Add User'}
      onCancel={() => {
        onClose();
        form.resetFields(); // ✅ reset form when user cancels modal
      }}
      onOk={() => form.submit()}
      okText={isEdit ? 'Update' : 'Submit'}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter email' },
            {
              pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Please enter a valid email address',
            },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          label="Profile Image URL"
          name="avatar"
          rules={[{ required: true, message: 'Please enter profile image URL' }]}
        >
          <Input placeholder="Enter avatar URL" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;