import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers } from '../features/users/userThunk';
import UserModal, { User } from '../components/UserModal';
import axios from '../api/axios';
import { Content } from 'antd/es/layout/layout';
import AppHeader from '../components/Header';
import {
  setPage, addLocalUser, updateLocalUser, removeLocalUser
} from '../features/users/userSlice';
import {
  Card, Avatar, Table, Button, Pagination, Spin, Input, Radio, message, Modal,
  Layout, Typography
} from 'antd';
import {
  EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, TableOutlined, AppstoreOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import '../styles/users.css';

const { confirm } = Modal;
const { Text } = Typography;

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { paginatedList: list, loading, error, page, total, per_page } = useSelector(
    (state: RootState) => state.users
  );

  const [isCardView, setIsCardView] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleModalSuccess = (user: User, isEdit: boolean) => {
    if (isEdit) {
      dispatch(updateLocalUser(user));
      message.success('User updated successfully');
    } else {
      dispatch(addLocalUser(user));
      message.success('User created successfully');
    }
    setModalOpen(false);
  };

  const handleDeleteUser = (user: User) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `${user.first_name} ${user.last_name} will be removed.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`/users/${user.id}`);
          dispatch(removeLocalUser(user.id));
          message.success('User deleted successfully');
        } catch (err) {
          message.error('Failed to delete user');
        }
      },
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredList = list
    .filter((user, index, self) => index === self.findIndex((u) => u.id === user.id))
    .filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    });

  const columns = [
    {
      title: 'Profile',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string) => <Avatar src={avatar} />,
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text style={{ color: '#1677ff' }}>{text}</Text>,
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEditUser(record)}
          />
          <Button
            danger
            className="deleteBtn"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record)}
          />
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: 24 }}>
        <div className="user-container">
          <Card
            title={
              <div style={{ display: 'flex', gap: 8 }}>
                <h3>Users</h3>
                <Radio.Group
                  value={isCardView ? 'card' : 'table'}
                  onChange={(e) => setIsCardView(e.target.value === 'card')}
                  buttonStyle="solid"
                  className="view-toggle-group"
                  style={{ marginTop: 17 }}
                >
                  <Radio.Button value="table">
                    <TableOutlined /> Table
                  </Radio.Button>
                  <Radio.Button value="card">
                    <AppstoreOutlined /> Card
                  </Radio.Button>
                </Radio.Group>
              </div>
            }
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                <Input
                  placeholder="Search user"
                  value={search}
                  onChange={handleSearchChange}
                  allowClear
                  suffix={<SearchOutlined />}
                  className="search-input"
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                  Create User
                </Button>
              </div>
            }
          >
            {loading ? (
              <Spin />
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : isCardView ? (
              <div className="card-grid">
                {filteredList.map((user) => (
                  <Card key={user.id} className="user-card" hoverable>
                    <Avatar src={user.avatar} size={64} />
                    <h3>
                      {user.first_name} {user.last_name}
                    </h3>
                    <p>{user.email}</p>
                    <div className="card-actions">
                      <Button
                        shape="circle"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUser(user)}
                      />
                      <Button
                        shape="circle"
                        danger
                        className="deleteBtn"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteUser(user)}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={filteredList.map((user) => ({ ...user, key: user.id }))}
                pagination={false}
              />
            )}

            <div className="pagination-container">
              <Pagination
                current={page}
                total={total}
                pageSize={per_page}
                onChange={(p) => dispatch(setPage(p))}
              />
            </div>
          </Card>

          <UserModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={handleModalSuccess}
            initialValues={editingUser}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Users;
